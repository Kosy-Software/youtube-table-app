const youtubeRegex = new RegExp("^(https://www.youtube.com/watch?v=)")

export function isValidYoutubeUrl(url: string) {
    return url && youtubeRegex.test(url)
}