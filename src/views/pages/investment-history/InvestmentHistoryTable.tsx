import ButtonWithLink from '../../../components/UiElements/Base/Buttons/ButtonWithLink'
import { Pagination, Table } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice'
import { useState } from 'react'
import { useGetInvestmentHistoryQuery } from '../../../store/api/investment_plans/plansApiSlice'

export default function InvestmentHistoryTable() {

    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const { data: user } = useGetUserQuery()

    const {data: history} = useGetInvestmentHistoryQuery({page: page.toString()})

    function copyLink() {
        navigator.clipboard.writeText(`https://office.capitalmarket.app/auth/register/${user?.ref_code}`)
        toast.success(t("Link copied!"))
    }

    return (
        <div className="">
            <ButtonWithLink label={t("Copy link")} link={`https://office.capitalmarket.app/auth/register/${user?.ref_code}`}
                onClick={() => copyLink()} />


            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th>{t("Date")}</th>
                        <th className="">{t("Amount")}</th>
                        <th className="">{t("Payment method")}</th>
                        <th className="text-end">{t("New investment value")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history?.results?.map((history, indexPayment) => {
                            return (
                                <tr key={indexPayment}>
                                    <td><span className='fw-bold'>{new Date(history.date).toLocaleString()}</span></td>
                                    <td><span className=''>${history.amount.toLocaleString()} USD</span></td>
                                    <td><span className=''>{history.pay_with_balance ? t("Paid with balance") : t("USDT TRC20")}</span></td>
                                    <td className='text-end'><span className=''>${history.before_investment_value.toLocaleString()} USD</span></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Pagination className="mb-0">
                <Pagination.Prev disabled={page == 1} onClick={() => setPage(page - 1)} />
                {[...Array(history?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page == history?.total_pages} onClick={() => setPage(page + 1)} />
            </Pagination>
        </div>
    )
}
