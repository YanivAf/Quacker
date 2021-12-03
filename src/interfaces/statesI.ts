export interface UserInfoStateI {
    username: string;
    email: string;
    picUrl: string;
    id: string;
}

export interface QuackInputsStateI {
    content: string;
}

export interface CredentialsStateI {
    email: string;
    password: string;
}

export interface NewCredentialsStateI {
    email: string;
    password: string;
    verifyPassword: string;
}
