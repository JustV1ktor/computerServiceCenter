export async function fetchToServer(destination, option, payload = {}) {

    if (option === 0) {
        return await (await fetch(`http://localhost:3000/${destination}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                authorization: localStorage.getItem('Authorization')
            },
            body: JSON.stringify(payload)
        })).json()
    } else {
        await fetch(`http://localhost:3000/${destination}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                authorization: localStorage.getItem('Authorization')
            },
            body: JSON.stringify(payload)
        })
    }
}