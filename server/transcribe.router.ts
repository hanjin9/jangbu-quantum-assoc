import { publicProcedure, router } from './_core/trpc';
import { transcribeAudio } from './_core/voiceTranscription';
import { z } from 'zod';

export const transcribeRouter = router({
  // 음성 파일을 텍스트로 변환
  transcribeAudio: publicProcedure
    .input(z.object({
      audioUrl: z.string().url(),
      language: z.string().optional().default('ko'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
        });
        
        // 결과 타입 확인
        if ('text' in result) {
          return {
            success: true,
            text: result.text,
            language: result.language || 'ko',
          };
        } else {
          return {
            success: false,
            error: result.error || '음성 인식에 실패했습니다.',
          };
        }
      } catch (error) {
        console.error('음성 인식 오류:', error);
        return {
          success: false,
          error: '음성 인식에 실패했습니다.',
        };
      }
    }),
});
