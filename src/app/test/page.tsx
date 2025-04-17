import { supabase } from '@/lib/supabase'

export default async function TestPage() {
  try {
    // 테스트 데이터 추가
    const { error: insertError } = await supabase
      .from('prompts')
      .insert([
        {
          title: '테스트 프롬프트',
          description: '테스트용 프롬프트입니다.',
          positive_prompt: 'test prompt',
          model_name: 'test',
          category: 'image',
          type: 'test',
          tags: ['test'],
          image_url: 'https://picsum.photos/200/300',
          is_paid: false
        }
      ])

    if (insertError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2 className="text-xl font-bold mb-2">연결 실패</h2>
          <p>에러 메시지: {insertError.message}</p>
          <p className="mt-2">테이블이 생성되지 않았거나 권한이 없습니다.</p>
        </div>
      )
    }

    // 데이터 조회
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .limit(1)

    if (error) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2 className="text-xl font-bold mb-2">연결 실패</h2>
          <p>에러 메시지: {error.message}</p>
        </div>
      )
    }

    return (
      <div className="p-4 bg-green-100 text-green-700 rounded">
        <h2 className="text-xl font-bold mb-2">연결 성공!</h2>
        <p>Supabase에 성공적으로 연결되었습니다.</p>
        <p className="mt-4">테스트 데이터: {JSON.stringify(data)}</p>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <h2 className="text-xl font-bold mb-2">연결 실패</h2>
        <p>예기치 않은 오류가 발생했습니다.</p>
      </div>
    )
  }
} 