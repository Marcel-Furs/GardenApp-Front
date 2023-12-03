async function runRequest(url, options, success_callback = (response, data) => {}, fail_callback = (response) => {}) {
    const response = await fetch(url, options)
    if(response.ok)
    {
      const data = await response.json();
      success_callback(response, data);
    }
    else
    {
      fail_callback(response);
  }
}

export async function post(url, body, success_callback = (response, data) => {}, fail_callback = (response) => {}, token=null) {
    const options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        mode: "cors"
      }
      if(token != null) {
        options.headers["Authorization"] = "Bearer " + token;
      }
      await runRequest(url, options, success_callback, fail_callback)
}

export async function get(url, success_callback = (response, data) => {}, fail_callback = (response) => {}, token=null) {
    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
      if(token != null) {
        options.headers["Authorization"] = "Bearer " + token;
      }
      await runRequest(url, options, success_callback, fail_callback)
}