export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    occupation?: string | null;
    phoneNumber?: string | null;
    signupCompletedAt?: string | Date | null;
    onboardingStep?: number;
    onboardingCompletedAt?: string | Date | null;
    avatar?: string;
    profile: Profile;
}

export interface Profile {
    id?: string;
    displayName: string;
    avatarKey: string;
    avatarUrl: string;
}
