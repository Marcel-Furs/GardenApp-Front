export const BASE_URL = "https://localhost:7033/api/v1"

export const ENDPOINTS = {
    Register: BASE_URL + "/Auth/register",
    Login: BASE_URL + "/Auth/login",
    UploadFile: BASE_URL + '/Plant/Create',
    UploadCalendar: BASE_URL + '/Calendar/create',
    Days: BASE_URL + '/Calendar/{id}/days',
    UpdateDayStatus: BASE_URL + '/Calendar/{dayId}/update',
    Data: BASE_URL + '/Chart/{id}/{city}/data',
    AddCity: BASE_URL + '/Chart/AddCity'
}