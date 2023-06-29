import React from "react";

export const ChatIcon = (props) => (
    props.variant === "edge" ?
        <svg viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M3.675 4.063c-.202.062-.466.291-.583.505-.068.125-.073.445-.082 6.346-.007 4.089.003 6.265.029 6.364.06.22.251.461.469.589l.192.113 3.811.011 3.812.011 2.188 1.75c1.204.963 2.248 1.792 2.319 1.842.318.224.806.129 1.036-.202l.114-.165.011-1.612.012-1.612 1.648-.011 1.649-.012.192-.113c.218-.128.409-.369.469-.589.026-.099.036-2.275.029-6.364-.009-5.901-.014-6.221-.082-6.346-.123-.225-.38-.442-.6-.508-.297-.088-16.346-.086-16.633.003M20 11v6h-1.554c-1.688 0-1.788.011-2.064.221-.08.061-.195.194-.254.295l-.108.184-.02 1.374-.02 1.374-2.06-1.648c-1.133-.907-2.114-1.678-2.18-1.714-.109-.06-.479-.067-3.93-.077L4 16.998V5h16v6"/>
        </svg>
    :
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <path d="M24,11.247A12.012,12.012,0,1,0,12.017,24H19a5.005,5.005,0,0,0,5-5V11.247ZM22,19a3,3,0,0,1-3,3H12.017a10.041,10.041,0,0,1-7.476-3.343,9.917,9.917,0,0,1-2.476-7.814,10.043,10.043,0,0,1,8.656-8.761A10.564,10.564,0,0,1,12.021,2,9.921,9.921,0,0,1,18.4,4.3,10.041,10.041,0,0,1,22,11.342Z"/>
            <path d="M8,9h4a1,1,0,0,0,0-2H8A1,1,0,0,0,8,9Z"/>
            <path d="M16,11H8a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z"/>
            <path d="M16,15H8a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z"/>
        </svg>
)