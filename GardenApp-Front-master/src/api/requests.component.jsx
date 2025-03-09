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

export async function get2(url, id, city, success_callback = (response, data) => {}, fail_callback = (response) => {}, token=null) {
  const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    if(token != null) {
      options.headers["Authorization"] = "Bearer " + token;
    }
    // Zastosowanie szablonu literałów, aby wstawić id i city do ścieżki URL
    const fullUrl = url.replace('{id}', id).replace('{city}', city);
    await runRequest(fullUrl, options, success_callback, fail_callback)
}

export async function get3(url, id, city, success_callback, fail_callback, token = null) {
  const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
      }
  };

  const fullUrl = url.replace('{id}', id).replace('{city}', city);

  try {
      const response = await fetch(fullUrl, options);
      if (response.ok) {
          const data = await response.json();
          success_callback(data); // Upewnij się, że przekazujesz dane do success_callback
      } else {
          fail_callback(response);
      }
  } catch (error) {
      fail_callback(error);
  }
}