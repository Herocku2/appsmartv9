import { useState } from 'react'
import { Badge, Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useGetWithdrawalsQuery } from '../../../store/api/withdrawals/withdrawalsApiSlice'
import ControlledPagination from '../../../components/UiElements/Base/Pagination'

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
                        <th className="">{t("Type")}</th>
                        <th className="">{t("Amount")}</th>

                        <th className="">{t("Status")}</th>
                        <th className="">{t("Hash")}</th>
                        <th className="text-end">{t("Detalles")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        withdrawals?.results?.map((withdrawal, indexWithdrawal) => {
                            return (
                                <tr key={indexWithdrawal}>
                                    <td><span className='fw-bold'>{new Date(withdrawal.date).toLocaleString()}</span></td>
                                    <td>{withdrawal.verbose_type}</td>
                                    <td>${withdrawal.amount.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} USD</td>
                                    <td className=''>{withdrawal.status == "1" ? <Badge bg="warning">{t("Pending")}</Badge> : (withdrawal.status == "2") ? <Badge bg="success">{t("Approved")}</Badge> :
                                        <Badge bg="danger">{t("Refused")}</Badge>}</td>
                                    <td >
                                        {withdrawal.payment_link ? (
                                            <a href={"https://bscscan.com/tx/" + withdrawal.payment_link} target='_blank' className='text-primary'>{t("View")}</a>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                    <td className='text-end text-danger'>
                                        {withdrawal?.refuse_message || " - "}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            {/* <Pagination className="mb-0">
                <Pagination.Prev disabled={page == 1} onClick={() => setPage(page - 1)} />
                {[...Array(withdrawals?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page == withdrawals?.total_pages} onClick={() => setPage(page + 1)} />
            </Pagination> */}

            <div className="d-flex justify-content-center">
                <ControlledPagination
                    currentPage={page}
                    totalPages={withdrawals?.total_pages || 1}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )

}
