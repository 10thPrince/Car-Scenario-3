import React from 'react'

const PrivateRoute = () => {
    const {userInfo} = useSelector((state)=> state.auth);
  return (
    <div>PrivateRoute</div>
  )
}

export default PrivateRoute