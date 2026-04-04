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
    profile: Profile;
}

export interface Profile {
    id: string;
    displayName: string;
    avatarKey: string;
    avatarUrl: string;
}