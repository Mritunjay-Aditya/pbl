import { Link, useLoaderData, useLocation, useNavigate, useRouteLoaderData } from "react-router-dom";
import GenericPage from "../../components/dashboard/GenericPage";
import { useContext, useMemo, useRef, useState } from "react";
import BIcon from "../../components/BIcon";
import { ApplicationContext } from "../../providers/ApplicationProvider";
import { AuthContext } from "../../providers/AuthProvider";
import { humanFileSize, humanFileSizePair } from "../../transferUtils";
import { DashboardContext } from "./Dashboard";
import TransferList from "../../components/dashboard/TransferList";
import { getTransferList } from "../../Api";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function OverviewPage({ }) {

    const { transfers } = useRouteLoaderData("dashboard")
    
    const recentTransfers = useMemo(() => transfers && transfers.slice(0, 5), [transfers])

    const { displayErrorModal, displaySuccessModal } = useContext(ApplicationContext)
    const { user } = useContext(AuthContext)
    const { storage, showSidebar, setShowUpgradeModal } = useContext(DashboardContext)

    const storagePercent = storage?.maxBytes ? Math.floor((storage?.usedBytes / storage?.maxBytes)) * 100 : 0

    console.log(storage)

    const navigate = useNavigate()

    const handleMoreStorageClicked = () => {
        if(user.plan != "pro") {
            setShowUpgradeModal(true)
        }
        else {
            displaySuccessModal("Request More Storage", `You are already on the Pro plan. To request more, send an email to ${process.env.REACT_APP_SUPPORT_EMAIL}. We make decisions on a case-by-case basis.`)
        }
    }

    const stats = [
        {
            name: 'Transfers', stat: transfers.length,
            icon: "send-fill",
            actionName: "View All",
            action: () => navigate("transfers")
        },
        // {
        //     name: 'Downloads', stat: `2`,
        //     actionName: "Last Week",
        //     action: () => { }
        // },
        {
            name: 'Used Storage', stat: <span>{storagePercent} <small>%</small></span>,
            icon: "database-fill",
            actionName: user.plan == "pro" ? "Request More Storage" : "Get More Storage",
            action: handleMoreStorageClicked
        },
    ]

    const gridClassNames = showSidebar ? "xl:grid-cols-2" : "lg:grid-cols-2"

    return (
        <GenericPage title={"Overview"}>
            <div className="mb-4">
                {/* <h3 className="text-base font-semibold leading-6 text-gray-900">Statistics</h3> */}
                <dl className={`mt-5 grid grid-cols-1 gap-5 ${gridClassNames} max-w-xl`}>
                    {stats.map((item) => (
                        <div
                            key={item.name}
                            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-sm sm:px-6 sm:pt-6 border"
                        >
                            <dt>
                                <div className="absolute rounded-md bg-primary p-3">
                                    <BIcon center name={item.icon} aria-hidden="true" className="h-6 w-6 text-white" />
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                                    <div className="text-sm">
                                        <button onClick={item.action} className="font-medium text-primary hover:text-primary-light">
                                            {item.actionName} &rarr;
                                        </button>
                                    </div>
                                </div>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
            <h3 className="font-semibold mb-1 text-gray-500">Recent</h3>
            <TransferList transfers={recentTransfers} />
        </GenericPage>
    )
}