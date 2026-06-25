import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import faq from '@/data/faq.json';
import { productsToContext, searchProducts } from '@/lib/product-search';

const systemPrompt = `Bạn là AI Sales Assistant của The Tool Center.
Tư vấn bằng tiếng Việt, rõ ràng, thân thiện, không bịa thông số hoặc giá nếu dữ liệu chưa có.
Ưu tiên bán đúng nhu cầu, không cố bán sản phẩm đắt nhất.
Khi thiếu thông tin, hãy hỏi thêm: vật liệu thi công, tần suất dùng, ngân sách, ngành nghề.
Khi khách có nhu cầu mua, thu lead: tên, số điện thoại, nhu cầu, ngân sách, khu vực.
Nếu dữ liệu sản phẩm chưa đủ, nói rõ và đề nghị chuyển sale hỗ trợ.`;

type IncomingMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function getLatestUserMessage(messages: IncomingMessage[]) {
  return [...messages].reverse().find((message) => message.role === 'user')?.content || '';
}

function fallbackReply(productContext: string) {
  if (productContext.startsWith('Không tìm thấy')) {
    return 'Em chưa tìm thấy sản phẩm khớp trong dữ liệu hiện có. Anh/chị cho em biết thêm nhu cầu sử dụng, vật liệu thi công và ngân sách để em gợi ý nhóm máy phù hợp hơn nhé.';
  }

  return `Em tìm thấy một số sản phẩm liên quan trong dữ liệu The Tool Center:\n\n${productContext}\n\nAnh/chị cho em biết thêm nhu cầu sử dụng, vật liệu thi công và ngân sách để em chốt model phù hợp nhất nhé.`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const messages: IncomingMessage[] = body.messages || [];
  const latestUserMessage = getLatestUserMessage(messages);
  const foundProducts = searchProducts(latestUserMessage, 6);
  const productContext = productsToContext(foundProducts);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ reply: fallbackReply(productContext), products: foundProducts });
  }

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'system',
        content: `Chỉ dùng danh sách sản phẩm liên quan dưới đây để tư vấn. Không tự bịa giá, tồn kho hoặc thông số.\n\n${productContext}\n\nFAQ mẫu: ${JSON.stringify(faq)}`,
      },
      ...messages,
    ],
    temperature: 0.35,
  });

  return NextResponse.json({
    reply: completion.choices[0]?.message?.content || 'Em chưa có câu trả lời phù hợp.',
    products: foundProducts,
  });
}
