import ButtonWithLink from '../../../components/UiElements/Base/Buttons/ButtonWithLink'
import { Tab, Tabs } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useGetUserQuery } from '../../../store/api/auth/authApiSlice'
import DirectPayments from './DirectPayments'
import PasivePayments from './PasivePayments'

export default function PaymentsTable() {

    const { t } = useTranslation()

    const { data: user } = useGetUserQuery()

    function copyLink() {
        navigator.clipboard.writeText(`https://office.capitalmarket.app/auth/register/${user?.ref_code}`)
        toast.success(t("Link copied!"))
    }

    const tabsData = [{title: t("Direct Payments"), content: <DirectPayments />, eventKey: "direct", disabled: false},
        {title: t("Pasive Payments"), content: <PasivePayments />, eventKey: "pasive", disabled: false},
        // {title: t("Binary Payments"), content: <BinaryPayments />, eventKey: "binary", disabled: false},
        // {title: t("Binary Points Records"), content: <BinaryPoints />, eventKey: "binary-points", disabled: false},
    ]


    return (
        <div className="">
            <ButtonWithLink label={t("Copy link")} link={`https://office.capitalmarket.app/auth/register/${user?.ref_code}`}
                onClick={() => copyLink()} />

            <Tabs defaultActiveKey="direct" className="my-5">
                {tabsData.map(({ eventKey, title, content, disabled }) => (
                    <Tab key={eventKey} eventKey={eventKey} title={title} disabled={disabled}>
                        {content}
                    </Tab>
                ))}
            </Tabs>
            
           
        </div>
    )
}
