const { ethers } = require("hardhat");

async function main(){
    const [deployer]=await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    console.log("Address of the token: ",hardhatToken.address);
}

main()
.then(()=>process.exit(0))
.catch((e)=>{
    console.error(e);
    process.exit(1);
})