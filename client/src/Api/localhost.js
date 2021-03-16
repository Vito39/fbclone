import axios from "axios";

const token = sessionStorage.getItem("token") || null;

export default axios.create({
    baseURL:"https://kamalfbclonebackend.herokuapp.com",
    headers : {"x-auth-token":token}
}
)