import { Button, Card, Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useGetReferralsQuery } from '../../../store/api/tree/treeApiSlice'
import ButtonWithLink from '../../../components/UiElements/Base/Buttons/ButtonWithLink'
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { copiarTexto } from '../../dashboards'

export default function ReferralsTable() {

    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const { data: referrals } = useGetReferralsQuery({ page: page.toString() })
    const { data: user } = useGetUserQuery()

    function copyLink() {
        copiarTexto(`https://office.capitalmarket.app/auth/register/${user?.ref_code}`, t("Link copied"))
    }

    return (
        <div className="">
            <ButtonWithLink label={t("Copy link")} link={`https://office.capitalmarket.app/auth/register/${user?.ref_code}`}
                onClick={() => copyLink()} />
            <Table responsive bordered className='mt-4'>
                <thead>
                    <tr>
                        <th>{t("User")}</th>
                        <th className="">{t("Phone")}</th>
                        <th className="">{t("Registration date")}</th>
                        <th className="text-end">{t("Status")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        referrals?.results?.map((referral, indexReferral) => {
                            return (
                                <tr key={indexReferral}>
                                    <td><span className='fw-bold'>{referral.referred_username}</span><br /> {referral.referred_email}</td>
                                    <td className="">{referral.referred_phone_number || t("No phone number")}</td>
                                    <td className="text-dark ">{new Date(referral.date).toLocaleString()}</td>
                                    <td className="text-dark fw-semibold text-end">{referral.status ? t("Active") : t("Inactive")}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Pagination className="mt-5">
                <Pagination.Prev disabled={page == 1} onClick={() => setPage(page - 1)}   />
                {[...Array(referrals?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page == referrals?.total_pages} onClick={() => setPage(page + 1)} />
            </Pagination>
        </div>
    )
}
