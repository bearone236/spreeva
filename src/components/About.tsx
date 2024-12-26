import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Clock,
  FileText,
  MessageSquare,
  Mic,
  Star,
  Target,
  Users,
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-[#FDF6F0]'>
      <main className='pt-14'>
        <section className='relative overflow-hidden py-20 md:py-32 mb-16'>
          <div className='container mx-auto px-4 relative z-10'>
            <div className='md:w-3/5'>
              <h1 className='text-5xl md:text-7xl font-bold mb-6 leading-tight text-[#1B2B3A]'>
                英語スピーキングの
                <br />
                <span className='text-[#F5B642]'>革命</span>が始まる
              </h1>
              <p className='text-xl mb-8 text-gray-700'>
                AIと共に、あなたの英語力を最大限に引き出す革新的なアプリ
              </p>
              <Button
                size='lg'
                className='bg-[#F5B642] text-white hover:bg-[#FF8C00] transition-colors text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl'
              >
                <Link href='/login' className='flex items-center'>
                  今すぐ始める <ArrowRight className='ml-2 h-6 w-6' />
                </Link>
              </Button>
            </div>
          </div>
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <div className='absolute top-0 right-0 w-2/5 h-full bg-[#F5B642] skew-x-12 transform origin-top-right'></div>
        </section>

        <section className='py-20 bg-gradient-to-r from-[#1B2B3A] to-[#2C3E50] text-white mb-16'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <h2 className='text-4xl md:text-5xl font-bold mb-8'>
                Spreevaとは？
              </h2>
              <p className='text-xl md:text-2xl leading-relaxed mb-10'>
                Spreevaは
                <span className='text-[#F5B642] font-semibold'>
                  「短い時間で質問の意図を瞬時に理解し、話に厚みを持たせる力」
                </span>
                {'　　　'}
                を習得することを目指す、革新的な英語学習プラットフォームです
              </p>
              <div className='bg-white/10 backdrop-blur-lg rounded-xl p-8 inline-block'>
                <p className='text-lg md:text-xl font-semibold'>
                  私たちの目標：
                </p>
                <p className='text-2xl md:text-3xl font-bold text-[#F5B642] mt-4'>
                  瞬時の理解と豊かな表現力の獲得
                </p>
              </div>
              <div className='text-2xl mb-4 max-w-3xl mx-auto mt-20'>
                <p>Spreevaで英語スピーキングの新たな可能性を探求しましょう</p>
                <p>
                  {' '}
                  今すぐ始めて、あなたの英語力を
                  <span className='font-bold text-[#F5B642]'>次のレベルへ</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='container mx-auto px-4 mb-16 pt-12'>
          <h2 className='text-4xl font-bold mb-12 text-center text-[#1B2B3A]'>
            <span className='border-b-4 border-[#F5B642] pb-2'>主な機能</span>
          </h2>
          <div className='grid md:grid-cols-2 gap-12'>
            <div className='bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-[#F5B642]'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='p-4 bg-[#F5B642] rounded-full'>
                  <Clock className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-3xl font-bold text-[#1B2B3A]'>
                  時間制限スピーキング
                </h3>
              </div>
              <p className='text-gray-700 text-lg leading-relaxed'>
                AIが生成するテーマで、瞬発的な英語力を鍛えます。レベルや時間を自由に設定可能で、実践的なスピーキング力を効率的に向上させます。
              </p>
            </div>
            <div className='bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-[#F5B642]'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='p-4 bg-[#F5B642] rounded-full'>
                  <FileText className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-3xl font-bold text-[#1B2B3A]'>
                  PDF質問練習
                </h3>
              </div>
              <p className='text-gray-700 text-lg leading-relaxed'>
                あなたの資料からAIが質問を生成。実践的な質疑応答トレーニングができます。ビジネスや学術的な場面で即座に対応する力を養います。
              </p>
            </div>
          </div>
        </section>

        <section className='bg-gradient-to-r from-[#1B2B3A] to-[#2C3E50] text-white py-20 mb-16 pt-12'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold mb-12 text-center'>
              <span className='border-b-4 border-[#F5B642] pb-2'>
                Spreevaの特徴
              </span>
            </h2>
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center transform hover:scale-105 transition-all duration-500'>
                <Target className='w-16 h-16 mx-auto mb-6 text-[#F5B642]' />
                <h3 className='text-2xl font-semibold mb-4'>
                  独自評価システム
                </h3>
                <p className='text-gray-300 text-lg'>
                  会話の質を高める独自の評価指標で、効果的な上達をサポート
                </p>
              </div>
              <div className='bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center transform hover:scale-105 transition-all duration-500'>
                <Star className='w-16 h-16 mx-auto mb-6 text-[#F5B642]' />
                <h3 className='text-2xl font-semibold mb-4'>基本機能無料</h3>
                <p className='text-gray-300 text-lg'>
                  必要な機能を制限なく利用可能。学習の継続性を重視
                </p>
              </div>
              <div className='bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center transform hover:scale-105 transition-all duration-500'>
                <Users className='w-16 h-16 mx-auto mb-6 text-[#F5B642]' />
                <h3 className='text-2xl font-semibold mb-4'>多用途対応</h3>
                <p className='text-gray-300 text-lg'>
                  テスト対策からビジネスまで、幅広いシーンで活用可能
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='container mx-auto px-4 mb-20 pt-12'>
          <h2 className='text-4xl font-bold mb-12 text-center text-[#1B2B3A]'>
            <span className='border-b-4 border-[#F5B642] pb-2'>
              こんな方におすすめ
            </span>
          </h2>
          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            <div className='flex items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>
              <Mic className='w-12 h-12 text-[#F5B642]' />
              <p className='text-gray-700 text-xl'>
                スピーキング力を向上したい方
              </p>
            </div>
            <div className='flex items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>
              <Target className='w-12 h-12 text-[#F5B642]' />
              <p className='text-gray-700 text-xl'>
                英語検定やTOEFL対策をしたい方
              </p>
            </div>
            <div className='flex items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>
              <Users className='w-12 h-12 text-[#F5B642]' />
              <p className='text-gray-700 text-xl'>
                ビジネス英語を練習したい方
              </p>
            </div>
            <div className='flex items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>
              <Star className='w-12 h-12 text-[#F5B642]' />
              <p className='text-gray-700 text-xl'>
                楽しみながら英語を学びたい方
              </p>
            </div>
          </div>
        </section>

        <section className='bg-[#1B2B3A] text-white py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-3xl font-bold mb-6'>
              アプリ向上にご協力ください
            </h2>
            <p className='text-lg mb-8 max-w-2xl mx-auto'>
              Spreevaをより良いサービスにするため、皆様のご意見をお聞かせください。
              短時間のアンケートにご協力いただけますと幸いです。
            </p>
            <Link
              href={process.env.NEXT_PUBLIC_SURVEY_URL || '#'}
              target='_blank'
              rel='noopener noreferrer'
              className='h-14 inline-flex items-center justify-center bg-[#F5B642] text-white transition-colors text-md font-semibold px-8 py-6 rounded-lg'
            >
              アンケートに回答する <MessageSquare className='ml-2 h-5 w-5' />
            </Link>
          </div>
        </section>
        <footer className='bg-[#1B2B3A] text-white py-8 mt-0.5'>
          <div className='container mx-auto px-4 text-center'>
            <p className='text-sm'>
              &copy; {new Date().getFullYear()} Spreeva - All rights reserved
            </p>
            <p className='text-sm mt-2'>Created by Kumakura Kazuya</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
