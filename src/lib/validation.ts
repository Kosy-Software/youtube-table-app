const youtubeRegex = new RegExp("^(https://[a-zA-Z]+.youtube.com)")

export function isValidYoutubeUrl(url: string) {
    return url && youtubeRegex.test(url);
}