import { Component } from "react";
import * as Backend from "../../build/index.main.mjs";
import * as Reach from "@reach-sh/stdlib/ALGO";
import { Context } from "../../Context";
import BidderViews from "./BidderViews";

export class Bidder extends Component {
    static contextType = Context;

    constructor(props) {
        super(props);

        this.state = {
            appState: "",
            args: [],
            resGetBid: null,
            resIsAuctionOn: null,
            
        };

        this.getBidExt = this.getBidExt.bind(this);
        this.isAuctionOnExt = this.isAuctionOnExt.bind(this);
    }

    componentDidMount() {
        const [, , , , , , ctc, , , ,] = this.context;

        this.interval = setInterval(async () => this.updateBalance(), 5000);

        Backend.Bidder(ctc[0], this);
    }

    async updateBalance() {        
        const [account, , , setBalance] = this.context;

        const balance = Reach.formatCurrency(await Reach.balanceOf(account), 4);
        setBalance(balance);
    }

    async informTimeout() {
        console.log("informTimeout");

        this.setState({
            appState: "informTimeout",
        });
    }

    async showBid(nftViewAddress, bid, address) {
        console.log("showBid");

         const addressFormat = Reach.formatAddress(address);
         const bidFormat = Reach.formatCurrency(bid, 4);
         
         this.setState({
             appState: "showBid",
             args: [nftViewAddress, bidFormat ,addressFormat],
         })
     }

     async seeOutcome(nftViewAddress, address) {
        console.log("seeOutcome");

        const addressFormat = Reach.formatAddress(address);

        this.setState({
            appState: "seeOutcome",
            args: [nftViewAddress, addressFormat],
            
        })
    }

    async getBid(nftViewAddress) {
        const bid = await new Promise(res => {
            console.log("getBid is called");

            this.setState({
                appState: "getBid",
                args: [nftViewAddress],
                resGetBid: res,
            });
        });
        console.log(bid);
        return bid;
    }
    getBidExt(bid) {
        console.log("getBidExt is called");
        this.state.resGetBid(bid);
    }

    async isAuctionOn(nftViewAddress) {
        console.log("isAuctionOn");

        const response = await new Promise (res => {
            this.setState({
                appState: "isAuctionOn",
                args: [nftViewAddress],
                resIsAuctionOn: res,
            })
        });
        return response;
    }

    isAuctionOnExt(res) {
        this.state.resIsAuctionOn(res);
    }

    render() {
        return (<BidderViews
            appState={this.state.appState}
            args={this.state.args}
            getBidReady={this.state.resGetBid !== null}
            getBid={this.getBidExt} 
            isAuctionOnReady={this.state.resIsAuctionOn !== null}
            isAuctionOn={this.isAuctionOnExt}
            
            />);
            
    }
}