import jwt from 'jsonwebtoken'


export const genToken = (id)=>{
    const token = jwt.sign({id}, process.env.jwt_secret, {expiresIn: "10d"})
    return token
}
