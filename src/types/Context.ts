export interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: unknown | null;
    login: (token: string, userData?: unknown) => void;
    logout: () => void;
    loading: boolean;
}


// use for notice. Type = error | alert == warning | information
export interface NoticeContextType {
    message: string,
    setMessage: (error: string) => void,
    type: NoticeType,
    setType: (type: NoticeType) => void,
}

export enum NoticeType {
    ERROR = "error",
    WARNING = "warning",
    ALERT = "alert",
    INFO = "info",
    SUCCESS = "success",
}