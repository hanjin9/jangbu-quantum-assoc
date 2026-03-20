/**
 * React Native 모바일 앱용 API 클라이언트
 * iOS/Android에서 프로필, 결제, 커뮤니티 기능 제공
 */

export interface MobileUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'silver' | 'gold' | 'platinum';
  joinDate: string;
  profileImage?: string;
}

export interface MobilePayment {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  tierName: string;
}

export interface MobileCommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  likes: number;
  comments: number;
  date: string;
  isLiked: boolean;
}

export interface MobileCheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  tierId: string;
  tierName: string;
  amount: number;
}

/**
 * 모바일 API 기본 클래스
 */
export class MobileApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'https://jangbuqntm-zfmcugcm.manus.space/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * 인증 토큰 설정
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * API 요청 수행
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (typeof options.headers === 'object' && options.headers !== null) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ========== 프로필 API ==========

  /**
   * 사용자 프로필 조회
   */
  async getProfile(): Promise<MobileUser> {
    return this.request<MobileUser>('/user/profile');
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(data: Partial<MobileUser>): Promise<MobileUser> {
    return this.request<MobileUser>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * 프로필 이미지 업로드
   */
  async uploadProfileImage(imageUri: string): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const response = await fetch(`${this.baseUrl}/user/profile-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }

    return response.json();
  }

  /**
   * 수강 이력 조회
   */
  async getEnrollmentHistory(): Promise<Array<{
    courseId: string;
    courseName: string;
    progress: number;
    status: 'enrolled' | 'completed' | 'dropped';
    enrolledDate: string;
    completedDate?: string;
  }>> {
    return this.request('/user/enrollments');
  }

  /**
   * 수료증 조회
   */
  async getCertificates(): Promise<Array<{
    id: string;
    courseName: string;
    issuedDate: string;
    certificateUrl: string;
  }>> {
    return this.request('/user/certificates');
  }

  /**
   * 수료증 다운로드
   */
  async downloadCertificate(certificateId: string): Promise<{ downloadUrl: string }> {
    return this.request(`/user/certificates/${certificateId}/download`);
  }

  // ========== 결제 API ==========

  /**
   * 결제 이력 조회
   */
  async getPaymentHistory(): Promise<MobilePayment[]> {
    return this.request('/payments/history');
  }

  /**
   * 현재 구독 정보 조회
   */
  async getCurrentSubscription(): Promise<{
    tierId: string;
    tierName: string;
    status: 'active' | 'paused' | 'cancelled';
    renewalDate: string;
    amount: number;
  }> {
    return this.request('/payments/subscription');
  }

  /**
   * 결제 세션 생성
   */
  async createCheckoutSession(tierId: string): Promise<MobileCheckoutSession> {
    return this.request('/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tierId }),
    });
  }

  /**
   * 구독 취소
   */
  async cancelSubscription(reason?: string): Promise<{ success: boolean }> {
    return this.request('/payments/subscription/cancel', {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * 구독 일시 중지
   */
  async pauseSubscription(): Promise<{ success: boolean }> {
    return this.request('/payments/subscription/pause', {
      method: 'POST',
    });
  }

  /**
   * 구독 재개
   */
  async resumeSubscription(): Promise<{ success: boolean }> {
    return this.request('/payments/subscription/resume', {
      method: 'POST',
    });
  }

  // ========== 커뮤니티 API ==========

  /**
   * 게시물 목록 조회
   */
  async getCommunityPosts(
    category?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    posts: MobileCommunityPost[];
    total: number;
    page: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });

    return this.request(`/community/posts?${params}`);
  }

  /**
   * 게시물 상세 조회
   */
  async getCommunityPost(postId: string): Promise<MobileCommunityPost & {
    content: string;
    comments: Array<{
      id: string;
      author: string;
      content: string;
      date: string;
      likes: number;
    }>;
  }> {
    return this.request(`/community/posts/${postId}`);
  }

  /**
   * 게시물 작성
   */
  async createCommunityPost(data: {
    title: string;
    content: string;
    category: string;
  }): Promise<MobileCommunityPost> {
    return this.request('/community/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 게시물 좋아요
   */
  async likeCommunityPost(postId: string): Promise<{ success: boolean; likes: number }> {
    return this.request(`/community/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  /**
   * 게시물 좋아요 취소
   */
  async unlikeCommunityPost(postId: string): Promise<{ success: boolean; likes: number }> {
    return this.request(`/community/posts/${postId}/unlike`, {
      method: 'POST',
    });
  }

  /**
   * 댓글 작성
   */
  async createComment(postId: string, content: string): Promise<{
    id: string;
    author: string;
    content: string;
    date: string;
  }> {
    return this.request(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  /**
   * 댓글 삭제
   */
  async deleteComment(postId: string, commentId: string): Promise<{ success: boolean }> {
    return this.request(`/community/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  /**
   * 커뮤니티 카테고리 조회
   */
  async getCommunityCategories(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    postCount: number;
  }>> {
    return this.request('/community/categories');
  }

  // ========== 검색 API ==========

  /**
   * 커뮤니티 게시물 검색
   */
  async searchCommunityPosts(
    query: string,
    page: number = 1
  ): Promise<{
    posts: MobileCommunityPost[];
    total: number;
  }> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
    });

    return this.request(`/community/search?${params}`);
  }

  // ========== 알림 API ==========

  /**
   * 알림 목록 조회
   */
  async getNotifications(): Promise<Array<{
    id: string;
    type: 'payment' | 'course' | 'community' | 'system';
    title: string;
    message: string;
    date: string;
    read: boolean;
  }>> {
    return this.request('/notifications');
  }

  /**
   * 알림 읽음 처리
   */
  async markNotificationAsRead(notificationId: string): Promise<{ success: boolean }> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }
}

// 싱글톤 인스턴스
export const mobileApi = new MobileApiClient();
