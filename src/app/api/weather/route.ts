import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const {searchParams} = new URL(request.url);
    console.log("searchParams"+searchParams);
    const address = searchParams.get("address");
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lon");

    let url = "";
    if(address){
        url = "https://api.openweathermap.org/data/2.5/weather?q="
        + address
        + "&appid=" 
        + process.env.OPENWEATHER_API_KEY;

    }else{
        url = "https://api.openweathermap.org/data/2.5/weather?lat=" 
        + latitude 
        + "&lon=" 
        + longitude 
        + "&appid=" 
        + process.env.OPENWEATHER_API_KEY;
    }
    const res = await fetch(url);
    // console.log("res"+res);
    const data = await res.json();
    // console.log("data"+data);
    return NextResponse.json(data);
}