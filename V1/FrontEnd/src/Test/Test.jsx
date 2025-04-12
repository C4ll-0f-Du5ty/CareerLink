import { useEffect, useRef } from 'react'

function Test() {
    const url = `ws://localhost:8000/ws/chat/`
    const chatSocket = useRef(null)
    const formRef = useRef(null)
    const divRef = useRef(null)

    useEffect(() => {
        chatSocket.current = new WebSocket(url)
        chatSocket.current.onmessage = (e) => {
            let data = JSON.parse(e.data)
            console.log(`data`, data)
            if (data.type === 'chat') {
                divRef.current.innerHTML += data.message;
            }
        }
        return () => {
            chatSocket.current.close();
        };
    }, [])

    useEffect(() => {
        if (formRef.current) {
            formRef.current.addEventListener('submit', (e) => {
                e.preventDefault()
                const message = e.target.m.value.trim();
                chatSocket.current.send(JSON.stringify({ 'message': message }));
                formRef.current.reset();
            })
            return () => {
                formRef.current.removeEventListener('submit', e => { })
            }
        }
    }, [formRef])

    return (
        <>
            <h1 className="mt-32">Hello</h1>
            <form ref={formRef}>
                <input type="text" name="m" />
            </form>

            <div ref={divRef}></div>
        </>
    )
}

export default Test
