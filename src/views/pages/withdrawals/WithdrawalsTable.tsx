import { useState } from 'react'
import { Badge, Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useGetWithdrawalsQuery } from '../../../store/api/withdrawals/withdrawalsApiSlice'

export default function WithdrawalsTable() {
    const [page, setPage] = useState(1)

    const { t } = useTranslation()

    const { data: withdrawals } = useGetWithdrawalsQuery({ page: page })

    return (
        <div>
            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th>{t("Date")}</th>
                        <th className="">{t("Amount")}</th>
                        <th className="">{t("Status")}</th>
                        <th className="text-end">{t("Hash")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        withdrawals?.results?.map((withdrawal, indexWithdrawal) => {
                            return (
                                <tr key={indexWithdrawal}>
                                    <td><span className='fw-bold'>{new Date(withdrawal.date).toLocaleString()}</span></td>
                                    <td>${withdrawal.amount.toLocaleString()} USD</td>
                                    <td className=''>{withdrawal.status == "1" ? <Badge bg="warning">{t("Pending")}</Badge> : (withdrawal.status == "2") ? <Badge bg="success">{t("Approved")}</Badge> :
                                        <Badge bg="danger">{t("Refused")}</Badge>}</td>
                                    <td className='text-end'>
                                        {withdrawal.payment_link ? (
                                            <a href={withdrawal.payment_link} target='_blank' className='text-primary'>{t("View")}</a>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Pagination className="mb-0">
                <Pagination.Prev disabled={page == 1} onClick={() => setPage(page - 1)} />
                {[...Array(withdrawals?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page == withdrawals?.total_pages} onClick={() => setPage(page + 1)} />
            </Pagination>
        </div>
    )

}
