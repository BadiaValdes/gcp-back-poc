export function checkJailTime(userTime: number){
    console.log(`${Date.now() - userTime} <= ${5 * 60 * 1000}`)
    return Date.now() - userTime <= 5 * 60 * 1000
}