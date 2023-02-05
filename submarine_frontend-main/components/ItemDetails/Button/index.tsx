import Button from '@mui/material/Button'

const ActionButton = ({ text, bgColor = "", borderColor = "", onClick, opacity = 1 }) => {
    return <Button onClick={onClick} sx={{ padding: "10px", width: "100%", opacity: `${opacity}`, bgcolor: `${bgColor !== '' ? bgColor : ''}`, border: `1px solid ${borderColor !== '' ? borderColor : 'none'} `, color: "#fff", fontSize: "17px", textTransform: "none" }}>{text}</Button>
}

export default ActionButton