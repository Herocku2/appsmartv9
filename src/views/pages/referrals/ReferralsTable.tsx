import { Button, Card, Pagination, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useActivateMasterCodeMutation, useGetReferralsQuery } from '../../../store/api/tree/treeApiSlice'
import ButtonWithLink from '../../../components/UiElements/Base/Buttons/ButtonWithLink'
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice'
import { useEffect, useState } from 'react'
import { copiarTexto } from '../../dashboards'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'

export default function ReferralsTable() {

    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const { data: referrals } = useGetReferralsQuery({ page: page.toString() })
    const [activateMasterCode, { isLoading, isSuccess, isError, error, data }] = useActivateMasterCodeMutation()
    const { data: user } = useGetUserQuery()

    function copyLink() {
        copiarTexto(`https://office.capitalmarket.app/auth/register/${user?.ref_code}`, t("Link copied"))

    }

    function handleOpenMasterConfirmation(id: number) {
        Swal.fire({
            title: t('Are you sure to convert in master?'),
            text: t('You will not be able to recover this action!'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3E97FF',
            confirmButtonText: t("Yes, i'm sure!"),
        }).then((result) => {
            if (result.isConfirmed) {
                activateMasterCode({ id: id })
            }
        })
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message)
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            toast.error(error?.message)
        }
    }, [isError])

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
                        <th className="">{t("Status")}</th>
                        {
                            user?.is_fundator && (
                                <th className="text-end">{t("Actions")}</th>
                            )
                        }

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
                                    <td className="text-dark fw-semibold ">{referral.status ? t("Active") : t("Inactive")}</td>


                                    {
                                        (user?.is_fundator) && (
                                            (!referral.is_master_code) ? (
                                                <td className="text-dark fw-semibold text-end">
                                                    <Button onClick={() => handleOpenMasterConfirmation(referral.id)}>
                                                        {isLoading ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading...
                                                            </>) : (
                                                            <>
                                                                {t("Make master")}
                                                            </>
                                                        )}
                                                    </Button>
                                                </td>
                                            ) : (
                                                <td className="text-dark fw-semibold text-end">
                                                    <span>{t("Master code activated!")}</span>
                                                </td>
                                            )
                                        )
                                    }

                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Pagination className="mt-5">
                <Pagination.Prev disabled={page == 1} onClick={() => setPage(page - 1)} />
                {[...Array(referrals?.total_pages)].map((_, index) => (
                    <Pagination.Item onClick={() => setPage(index + 1)} key={index}>{index + 1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page == referrals?.total_pages} onClick={() => setPage(page + 1)} />
            </Pagination>
        </div>
    )
}
