import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import products from '@/data/products.json';
import faq from '@/data/faq.json';

const systemPrompt = `Bạn là AI Sales Assistant của The Tool Center.
Tư vấn bằng tiếng Việt, rõ ràng, thân thiện, không bịa thông số hoặc giá nếu dữ liệu chưa có.
Ưu tiên bán đúng nhu cầu, hỏi thêm khi thiếu thông tin.
Khi khách có nhu cầu mua, thu lead: tên, số điện thoại, nhu cầu, ngân sách, khu vực.`;

export async function POST(request: Request) {
  const body = await request.json();
  const messages = body.messages || [];

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply:
        'Bản demo chưa cấu hình OPENAI_API_KEY. Hiện em có thể tư vấn mẫu: anh/chị cho em biết nhu cầu sử dụng, vật liệu thi công và ngân sách để em gợi ý nhóm máy phù hợp.',
    });
  }

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'system',
        content: `Dữ liệu sản phẩm mẫu: ${JSON.stringify(products)}\nFAQ mẫu: ${JSON.stringify(faq)}`,
      },
      ...messages,
    ],
    temperature: 0.4,
  });

  return NextResponse.json({
    reply: completion.choices[0]?.message?.content || 'Em chưa có câu trả lời phù hợp.',
  });
}
