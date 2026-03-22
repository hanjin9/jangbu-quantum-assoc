/**
 * 라이브 강의 시스템
 * - 실시간 비디오 스트리밍
 * - 실시간 채팅
 * - 자동 녹화 저장
 */

export interface LiveSession {
  id: number;
  lectureId: number;
  title: string;
  description: string;
  instructorId: number;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'live' | 'ended';
  viewerCount: number;
  streamUrl: string;
  recordingUrl?: string;
  isRecording: boolean;
  chatEnabled: boolean;
}

export interface LiveChat {
  id: number;
  sessionId: number;
  userId: number;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'question';
}

export interface LiveViewer {
  id: number;
  sessionId: number;
  userId: number;
  joinedAt: Date;
  leftAt?: Date;
  watchDuration: number; // 분 단위
}

/**
 * 라이브 강의 세션 생성
 */
export async function createLiveSession(
  lectureId: number,
  title: string,
  description: string,
  instructorId: number,
  startTime: Date
): Promise<LiveSession> {
  console.log(`[LiveStream] Creating live session: ${title}`);

  const session: LiveSession = {
    id: Math.floor(Math.random() * 10000),
    lectureId,
    title,
    description,
    instructorId,
    startTime,
    status: 'scheduled',
    viewerCount: 0,
    streamUrl: `https://stream.example.com/live/${Math.random().toString(36).substring(7)}`,
    isRecording: false,
    chatEnabled: true,
  };

  // DB에 저장
  // INSERT INTO live_sessions (...) VALUES (...)

  // 예약된 강의 알림 발송
  await notifyScheduledLecture(session);

  return session;
}

/**
 * 라이브 강의 시작
 */
export async function startLiveSession(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Starting live session ${sessionId}`);

  // 1. 세션 상태를 'live'로 변경
  await updateSessionStatus(sessionId, 'live');

  // 2. 자동 녹화 시작
  await startRecording(sessionId);

  // 3. 모든 구독자에게 라이브 시작 알림
  await notifyLiveStart(sessionId);

  // 4. 시스템 메시지 채팅에 추가
  await addSystemMessage(sessionId, '라이브 강의가 시작되었습니다.');

  console.log(`[LiveStream] Live session ${sessionId} started`);
}

/**
 * 라이브 강의 종료
 */
export async function endLiveSession(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Ending live session ${sessionId}`);

  // 1. 세션 상태를 'ended'로 변경
  await updateSessionStatus(sessionId, 'ended');

  // 2. 녹화 중지
  await stopRecording(sessionId);

  // 3. 시스템 메시지 채팅에 추가
  await addSystemMessage(sessionId, '라이브 강의가 종료되었습니다.');

  // 4. 시청 이력 저장
  await saveViewerHistory(sessionId);

  // 5. 녹화 영상 처리 (변환, 저장)
  await processRecording(sessionId);

  // 6. 협회장에게 알림
  await notifyOwnerOfSessionEnd(sessionId);

  console.log(`[LiveStream] Live session ${sessionId} ended`);
}

/**
 * 세션 상태 업데이트
 */
async function updateSessionStatus(
  sessionId: number,
  status: 'scheduled' | 'live' | 'ended'
): Promise<void> {
  console.log(`[LiveStream] Updating session ${sessionId} status to ${status}`);

  // DB 업데이트
  // UPDATE live_sessions SET status = status WHERE id = sessionId
}

/**
 * 자동 녹화 시작
 */
async function startRecording(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Starting recording for session ${sessionId}`);

  // 실제 구현에서는 스트리밍 서버에 녹화 시작 명령
  // await streamingServer.startRecording(sessionId)

  // DB 업데이트
  // UPDATE live_sessions SET isRecording = true WHERE id = sessionId
}

/**
 * 녹화 중지
 */
async function stopRecording(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Stopping recording for session ${sessionId}`);

  // 실제 구현에서는 스트리밍 서버에 녹화 중지 명령
  // await streamingServer.stopRecording(sessionId)

  // DB 업데이트
  // UPDATE live_sessions SET isRecording = false WHERE id = sessionId
}

/**
 * 녹화 영상 처리
 */
async function processRecording(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Processing recording for session ${sessionId}`);

  // 1. 녹화 파일 다운로드
  // const recordingFile = await downloadRecording(sessionId)

  // 2. 비디오 변환 (MP4, 썸네일 생성 등)
  // const convertedFile = await convertVideo(recordingFile)

  // 3. S3에 업로드
  // const recordingUrl = await uploadToS3(convertedFile)

  // 4. DB 업데이트
  // UPDATE live_sessions SET recordingUrl = recordingUrl WHERE id = sessionId

  // 5. 시청자에게 녹화 영상 공개 알림
  // await notifyRecordingAvailable(sessionId)
}

/**
 * 라이브 채팅 메시지 추가
 */
export async function addChatMessage(
  sessionId: number,
  userId: number,
  userName: string,
  message: string,
  type: 'message' | 'system' | 'question' = 'message'
): Promise<LiveChat> {
  console.log(`[LiveStream] Adding chat message to session ${sessionId}`);

  const chat: LiveChat = {
    id: Math.floor(Math.random() * 10000),
    sessionId,
    userId,
    userName,
    message,
    timestamp: new Date(),
    type,
  };

  // DB에 저장
  // INSERT INTO live_chats (...) VALUES (...)

  // 모든 시청자에게 브로드캐스트
  // await broadcastChatMessage(chat)

  return chat;
}

/**
 * 시스템 메시지 추가
 */
async function addSystemMessage(sessionId: number, message: string): Promise<void> {
  console.log(`[LiveStream] Adding system message to session ${sessionId}`);

  await addChatMessage(sessionId, 0, 'System', message, 'system');
}

/**
 * 라이브 채팅 목록 조회
 */
export async function getLiveChat(sessionId: number, limit: number = 50): Promise<LiveChat[]> {
  console.log(`[LiveStream] Fetching live chat for session ${sessionId}`);

  // 실제 구현에서는 DB에서 조회
  return [
    {
      id: 1,
      sessionId,
      userId: 1,
      userName: '김민준',
      message: '좋은 강의 감사합니다!',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'message',
    },
    {
      id: 2,
      sessionId,
      userId: 2,
      userName: '이영희',
      message: '이 부분을 더 자세히 설명해주실 수 있나요?',
      timestamp: new Date(Date.now() - 3 * 60000),
      type: 'question',
    },
  ];
}

/**
 * 시청자 수 업데이트
 */
export async function updateViewerCount(sessionId: number): Promise<number> {
  console.log(`[LiveStream] Updating viewer count for session ${sessionId}`);

  // 실제 구현에서는 DB에서 현재 시청자 수 조회
  // SELECT COUNT(*) FROM live_viewers WHERE sessionId = sessionId AND leftAt IS NULL

  return Math.floor(Math.random() * 100) + 10;
}

/**
 * 시청자 입장 기록
 */
export async function recordViewerJoin(sessionId: number, userId: number): Promise<void> {
  console.log(`[LiveStream] Recording viewer join for session ${sessionId}, user ${userId}`);

  // DB에 저장
  // INSERT INTO live_viewers (sessionId, userId, joinedAt) VALUES (...)

  // 시청자 수 업데이트
  const viewerCount = await updateViewerCount(sessionId);

  // 시스템 메시지 추가
  // await addSystemMessage(sessionId, `${userName}님이 입장했습니다. (총 ${viewerCount}명)`)
}

/**
 * 시청자 퇴장 기록
 */
export async function recordViewerLeave(sessionId: number, userId: number): Promise<void> {
  console.log(`[LiveStream] Recording viewer leave for session ${sessionId}, user ${userId}`);

  // DB 업데이트
  // UPDATE live_viewers SET leftAt = NOW() WHERE sessionId = sessionId AND userId = userId

  // 시청 시간 계산
  // SELECT TIMESTAMPDIFF(MINUTE, joinedAt, NOW()) as watchDuration FROM live_viewers WHERE sessionId = sessionId AND userId = userId

  // 시청자 수 업데이트
  await updateViewerCount(sessionId);
}

/**
 * 예약된 강의 알림 발송
 */
async function notifyScheduledLecture(session: LiveSession): Promise<void> {
  console.log(`[LiveStream] Notifying scheduled lecture: ${session.title}`);

  // 모든 구독자에게 알림 발송
  // await sendNotification({
  //   type: 'scheduled_lecture',
  //   title: `예정된 라이브 강의: ${session.title}`,
  //   startTime: session.startTime
  // })
}

/**
 * 라이브 시작 알림 발송
 */
async function notifyLiveStart(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Notifying live start for session ${sessionId}`);

  // 모든 구독자에게 알림 발송
  // await sendNotification({
  //   type: 'live_started',
  //   title: '라이브 강의가 시작되었습니다',
  //   sessionId
  // })
}

/**
 * 라이브 세션 종료 알림
 */
async function notifyOwnerOfSessionEnd(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Notifying owner of session end`);

  // 협회장 알림 로직
  // await notifyOwner({
  //   title: '라이브 강의 종료',
  //   content: `라이브 강의가 종료되었습니다. 녹화 영상이 처리 중입니다.`
  // })
}

/**
 * 시청 이력 저장
 */
async function saveViewerHistory(sessionId: number): Promise<void> {
  console.log(`[LiveStream] Saving viewer history for session ${sessionId}`);

  // 모든 시청자의 시청 시간 계산 및 저장
  // SELECT userId, TIMESTAMPDIFF(MINUTE, joinedAt, COALESCE(leftAt, NOW())) as watchDuration
  // FROM live_viewers WHERE sessionId = sessionId
}

/**
 * 라이브 세션 목록 조회
 */
export async function getLiveSessions(status?: 'scheduled' | 'live' | 'ended'): Promise<LiveSession[]> {
  console.log(`[LiveStream] Fetching live sessions (status: ${status})`);

  // 실제 구현에서는 DB에서 조회
  return [
    {
      id: 1,
      lectureId: 1,
      title: '기초 양자요법 입문 라이브',
      description: '양자요법의 기초를 배우는 라이브 강의입니다.',
      instructorId: 1,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'scheduled',
      viewerCount: 0,
      streamUrl: 'https://stream.example.com/live/abc123',
      isRecording: false,
      chatEnabled: true,
    },
    {
      id: 2,
      lectureId: 2,
      title: '고급 에너지 치유법',
      description: '고급 에너지 치유 기법을 배우는 라이브 강의입니다.',
      instructorId: 2,
      startTime: new Date(),
      status: 'live',
      viewerCount: 45,
      streamUrl: 'https://stream.example.com/live/def456',
      isRecording: true,
      chatEnabled: true,
    },
  ];
}
