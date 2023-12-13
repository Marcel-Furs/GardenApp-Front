export const BASE_URL = "https://localhost:7033/api/v1"

export const ENDPOINTS = {
    Register: BASE_URL + "/Auth/register",
    Login: BASE_URL + "/Auth/login",
    UploadFile: BASE_URL + '/Plant/ImportFile',
    UploadCalendar: BASE_URL + '/Calendar/create'
}