"use client";

import React, {useState} from "react";
import SalesAreaChart from "./salesAreaChart";
import {Button} from "@/components/ui/button";
import TransactionBarChart from "./transactionsBarChart";
import LineChartUsers from "./lineChart";

export default function Charts() {
    const [chart, setChart] = useState("sales");
    return (
        <div className="flex justify-between w-screen container flex-col">
            <div className="flex gap-3 flex-wrap">
                <Button variant={"outline"} onClick={() => setChart("sales")}>
                    Sales
                </Button>
                <Button variant={"outline"} onClick={() => setChart("newUsers")}>
                    New Users
                </Button>
                <Button variant={"outline"} onClick={() => setChart("transactions")}>
                    Failed Transactions
                </Button>
            </div>
            {chart == "sales" ? (
                <div className="w-full h-[500px] mt-10">
                    <SalesAreaChart/>
                </div>
            ) : chart == "transactions" ? (
                <div className="w-full h-[500px] mt-10">
                    <TransactionBarChart/>
                </div>
            ) : (
                <div className="w-full h-[500px] mt-10">
                    <LineChartUsers/>
                </div>
            )}
        </div>
    );
}
