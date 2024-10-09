import { useLayoutEffect, useRef, useState } from "react";
import Loading from "../../../components/Misc/Loading";
// @ts-ignore
import { OrgChart } from 'd3-org-chart';

export const OrgChartComponent = ({ data }: {data: TreeLeaf[]}) => {
    const d3Container = useRef(null);
    const [chartRendered, setChartRendered] = useState(false)

    // We need to manipulate DOM
    useLayoutEffect(() => {
        if (data && d3Container.current) {
            const chart = new OrgChart();
            
            chart
                .container(d3Container.current)
                .data(JSON.parse(JSON.stringify(data)))
                .nodeHeight(() => 70)
                .nodeWidth(() => {
                    return 250;
                })
                .childrenMargin(() => 50)
                .compactMarginBetween(() => 35)
                .compactMarginPair(() => 30)
                .buttonContent(({ node }: {node: {children: number}}) => {
                    return `<div class="bg-light" style="border-radius:3px;padding:3px;font-size:10px;margin:auto auto; border-radius: 50%"> 
                        <span style="font-size:12px">${node.children
                            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                      </svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                      </svg>`
                    }</span> </div>`;
                })
                .nodeContent(function (d : {data: TreeLeaf, width: number, height: number}) {
                    return `
                    <div class="bg-light" style="position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:50px">
                       <img src=" ${(d.data.username != "None") ? d.data.imageUrl : ""}" 
                        style="position:absolute;margin-top:5px;margin-left:${5}px;border-radius:100px;width:60px;height:60px;" />
                       <div  style="position:absolute;top:-15px;width:${d.width}px;text-align:center;">
                             <div class="bg-light" style="margin:0 auto;display:inline-block;padding:8px;padding-bottom:0px;border-radius:5px"> ${(d.data.username != "None") ? d.data.username : ""}</div>
                      </div>
                      <div class="text-dark" style="font-size: 16px;margin-left:70px;margin-top:15px"> ${(d.data.username != "None") ? d.data.name: ""} </div>
                      <div class="text-dark" style="margin-left:70px;margin-top:5px"> ${(d.data.username != "None") ? d.data.plan_name +" USD": ""}</div>
                   </div>`;
                }).
                compact(false)
                .render();
                setChartRendered(true)
        }
        
    }, [data, d3Container.current]);

    return (
        <div>
        {
            (!chartRendered) && (
                <Loading />
            )
        }
                <div ref={d3Container} />
            
            
        </div>
    );
};