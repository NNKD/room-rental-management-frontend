export interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    username: string | null;
    login: (token: string, userData?: string) => void;
    logout: () => void;
    loading: boolean;
    isLogout: boolean;
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