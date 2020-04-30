const utils = require('@gnosis.pm/safe-contracts/test/utils/execution')
const utilsg = require('@gnosis.pm/safe-contracts/test/utils/general')
const ethUtil = require('ethereumjs-util')

const CreateAndAddModules = artifacts.require("CreateAndAddModules")
const GnosisSafe = artifacts.require("GnosisSafe")
const ProxyFactory = artifacts.require("GnosisSafeProxyFactory")
const ThreeBoxRecoveryModule = artifacts.require("ThreeBoxRecoveryModule")
const ModuleDataWrapper = new web3.eth.Contract([{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);

contract('ThreeBoxRecoveryModule', function(accounts) {
    let gnosisSafeMasterCopy
    let gnosisSafe
    let proxyFactory
    let createAndAddModules
    let threeBoxRecoveryModule

    beforeEach(async function () {
        // Create lightwallet        
        console.log(ethUtil)
        let privateKey = ethUtil.sha256(Buffer.from('klasdhfsahdlf'))
        console.log('privateKey',privateKey.toString('hex'))
        let address = ethUtil.privateToAddress(privateKey)
        console.log(address.toString('hex'))

        // Create Master Copies
        // console.log('1');
        
        proxyFactory = await ProxyFactory.new()
        // console.log('12');
        createAndAddModules = await CreateAndAddModules.new()
        // console.log('123');
        gnosisSafeMasterCopy = await GnosisSafe.new()
        // console.log('1234');
        threeBoxRecoveryModuleMaster = await ThreeBoxRecoveryModule.deployed()
        // console.log('12345',threeBoxRecoveryModuleMaster.contract.methods);
        
        //Create Safe and Add module
        let moduleData = await threeBoxRecoveryModuleMaster.contract.methods.setup(accounts[5]).encodeABI()
        // console.log('asdasd',moduleData);
        
        let proxyFactoryData = await proxyFactory.contract.methods.createProxy(threeBoxRecoveryModuleMaster.address, moduleData).encodeABI()
        // console.log('proxyFabrtyDAta', proxyFactoryData);
        // console.log('utils',utils);
        let modulesCreationData = utilsg.createAndAddModulesData([proxyFactoryData])
        // console.log(proxyFactory.address)
        let createAndAddModulesData = createAndAddModules.contract.methods.createAndAddModules(proxyFactory.address, modulesCreationData).encodeABI()
        // console.log('createAndAddModulesData',createAndAddModulesData);
        
        let gnosisSafeData = await gnosisSafeMasterCopy.contract.methods.setup(
            [accounts[0], accounts[1]], 2, createAndAddModules.address, createAndAddModulesData, utilsg.Address0, utilsg.Address0, 0, utilsg.Address0
        ).encodeABI()
        // console.log('gnosisSafeData',gnosisSafeData);
        
        // Deploy This thing
        gnosisSafe = await utilsg.getParamFromTxEvent(
            await proxyFactory.createProxy(gnosisSafeMasterCopy.address, gnosisSafeData),
            'ProxyCreation', 'proxy', proxyFactory.address, GnosisSafe, 'create Gnosis Safe and 3Box Recovery Module',
        )

        // console.log('gnosis sfae', gnosisSafe);
        
        let modules = await gnosisSafe.getModules()
        // console.log('Modules', modules);
        
        threeBoxRecoveryModule = await ThreeBoxRecoveryModule.at(modules[0])
    })

    it ('should change owner for backup address', async () => {
        let sentinel = "0x0000000000000000000000000000000000000001"
        // let privateKey = ethUtil.sha3('asdfasdfsadsadasdf')
        // let address = ethUtil.privateToAddress(privateKey)        
        let recoverAccessData = await threeBoxRecoveryModule.recoverAccess(sentinel, accounts[0], accounts[5], {from: accounts[5]})
        assert.equal(await gnosisSafe.isOwner(accounts[5]), true);
        // Sign Transtion using Private Key
        // var msgHash = ethUtil.hashPersonalMessage(new Buffer(recoverAccessData));
        // var signature = ethUtil.ecsign(msgHash, new Buffer(privateKey, 'hex')); 
        // var signatureRPC = ethUtil.toRpcSig(signature.v, signature.r, signature.s)
        // // console.log(signatureRPC);
    })
})

