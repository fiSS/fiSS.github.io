import img from "./error.gif";
import { Component } from "react/cjs/react.production.min";

class ErrorMessage extends Component {
    render() {
        return (
            <img style={{ display: 'block', width: "250px", height: "250px", objectFit: 'contain', margin: "0 auto" }} src={img} alt="error" />
        )
    }
}

export default ErrorMessage;
