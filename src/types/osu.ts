export type User = {
    avatar_url: string

    country: {
        code: string
        name: string
    }

    name: string
    osu_id: number
    pp: number
    survey_result: unknown
}

export type LoginResponse = {
    user: User
    authTokenExpiresIn: number
    refreshTokenExpiresIn: number
}

export type RefreshTokenResponse = {
    authTokenExpiresIn: number,
    refreshTokenExpiresIn: number
}