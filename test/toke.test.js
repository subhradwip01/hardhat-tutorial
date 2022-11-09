const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Token contract", function () {
  let Token, hardhatToken, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // transfer 10 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 10);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10);

      // transfer 5 tokens from addr1 to addr2
      await hardhatToken.connect(addr1).transfer(addr2.address, 6);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(6);
    });

    it("Should fail if does not have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); // 10000
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1) // initally addr1 -- 0 tokens => so cannot not send tokens
      ).to.be.revertedWith("Not enough tokens");
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transaction",async function(){
        // Fetching inital balnce of each address
        const initalBalanceOfOwner = await hardhatToken.balanceOf(owner.address);
       
        //Case 1:
        // Owner to addr1
       // Owner==>10000
       // Send 10 to addr1
       // Owner should have 10000-10
       // addr1 should have 10

       await hardhatToken.transfer(addr1.address,10);
       expect(await hardhatToken.balanceOf(owner.address)).to.equal(initalBalanceOfOwner-10);
       expect(await hardhatToken.balanceOf(addr1.address)).to.equals(10);



       const currentBalanceOfAddr1=await hardhatToken.balanceOf(addr1.address);
       //Case 2:
       // addr1 to addr2
       // addr1 ==> 10
       // addr1 send 6 to addr2
       // addr2 should have 6
       // addr1 should have 4

       await hardhatToken.connect(addr1).transfer(addr2.address,6);
       expect(await hardhatToken.balanceOf(addr1.address)).to.equal(currentBalanceOfAddr1-6);
       expect(await hardhatToken.balanceOf(addr2.address)).to.equal(6);

    })
  });
});
