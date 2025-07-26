const Logo = ({url=""}:{url: string}) => {
  return (
    <div>
      <div className="row mt-4 mx-auto">
        <img src={url || "/smartsolutionlogo.png"} className="" style={{maxWidth: "420px"}} />
        {/* <div className="logo-text mx-auto"></div> */}
      </div>
    </div>
  )
}

export default Logo
