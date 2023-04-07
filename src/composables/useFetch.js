import { ref, watchEffect } from "vue"

const useFetch = (urlVal) => {
    const data = ref(null)
    const pending = ref(true)
    const error = ref(false)

    const getData = async (url) => {
        try {
            const res = await fetch(url)
            if (!res.ok) {
                throw Error("Could not fetch the data")
            }
            data.value = await res.json()
            pending.value = false
        } catch (err) {
            error.value = err.message
            pending.value = false
        }
    }

    watchEffect(async () => {
        if (urlVal.value) {
            getData(urlVal.value)
        } else {
            getData(urlVal)
        }
    })

    return { data, pending, error }
}

export default useFetch
