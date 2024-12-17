chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getClass") {
        getClassInfo(message.token, message.fid);
    } else if (message.action === "registerClass") {
        registerClass(message.token, message.classId);
    }
});

async function getClassInfo(token, fid) {
    try {
        const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=classbymodulesid&v=${token}`;
        let options = {
            "method": "POST",
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "vi",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "https://sv.haui.edu.vn",
                // "cookie": "kVisit=fdde94f8-d9c9-4af6-a820-ab1bbe9d85b1; ASP.NET_SessionId=oe2kic5uacche0mv4wzduqiy; __Host-UqZBpD3n=v1Uh+GSQ__YGU; onehauisv=FC1D342CD4C385F869AB52E50BAD88A2F0C9A8E8ACFEBEC716BE0B6F9A75C0C2F7195C4980D0CEB8C981510F29BEF700D5F0EC144DE59DDD50FC5A7E92A627A985A87B922FF9C1D0DFF978EADBE3C9DC8472886DCBCDB9C0513DF4D9F160C157B38BEC8AE92918C48199A7A3D5487286D749B15896249B116DAB7D35A539EEF38BC08E68DAB9A1C0326920F052181E52617CAF8D8CA3BEC14768B80CDB34685C5E5E8AD5D7918E301254B7E0E1915DD1D0769EFCDD66FC44F6FB3F857D6F740888964E89CC4F614371A6D3592452568D3F51EE2E6B1457EED305A0456C23CE588DE4FBBFD4602C01A02361CDEC2CA430AC0F2A40F8B70F9E743F2DD8184DF922FC6DE270AFA1971AF15F1F70DDBF33201896CD9D0F89D41D07B26E935ABD0EF393B258133204A01947B2DBE2D550D914B47D83B94E3957B6432A969A3334483DC2EC31EC4F31A9B80744937C9B8B85C2112FFC629A2A6BB08DC5849D5D8F25C526C1CF3CA48D02C5350A0D170C4D607B",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sv.haui.edu.vn/register/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `fid=${fid}`,
            "mode": "cors",
            "credentials": "include"
        };

        console.log("Payload being sent:", options.body);
        console.log(url);
        let response = await fetch(url, options);
        console.log("Response URL:", response.url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log("Class Info:", data);
        chrome.runtime.sendMessage({ action: "displayData", data });
    } catch (err) {
        console.error("Error fetching class info:", err.message);
        chrome.runtime.sendMessage({ action: "error", message: err.message });
    }
}

async function registerClass(token, classId, cookieString) {
    try {
        const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=addclass&v=${token}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": cookieString,
            },
            body: `class=${classId}`,
            credentials: "include",
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${await response.text()}`);
        }

        console.log("Registration successful!");
        chrome.runtime.sendMessage({action: "registrationSuccess"}); //Send a message instead of directly using alert

    } catch (err) {
        console.error("Error registering class:", err.message);
        chrome.runtime.sendMessage({action: "registrationFailure", message: err.message}); //Send a message instead of directly using alert
    }
}

