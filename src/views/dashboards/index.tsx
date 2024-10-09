import { Badge, Button, Card, } from 'react-bootstrap'

import { useTranslation } from 'react-i18next'
import { useGetUserQuery } from '../../store/api/auth/authApiSlice'
import { useThemeContext } from '../../common'
import colors from '../../constants/colors'
import ReactApexChart from 'react-apexcharts'
import { useState } from 'react'
import PurchasePlanModal from '../investmentplans/Modals/PurchasePlan'
import TitleHelmet from '../../components/Common/TitleHelmet'
import { useGetDashboardStadisticsQuery } from '../../store/api/dashboard/useDashboardApiSlice'
import ButtonWithLink from '../../components/UiElements/Base/Buttons/ButtonWithLink'
import toast from 'react-hot-toast'



const Dashboard = () => {
  const { t } = useTranslation()
  const { data: user } = useGetUserQuery()

  const { settings } = useThemeContext()
  const selectedColor = settings.color as keyof typeof colors
  const themeColor = colors[selectedColor] || selectedColor

  const { data } = useGetDashboardStadisticsQuery()

  const apexOptions: ApexCharts.ApexOptions = {
    chart: {
      stacked: false,
      foreColor: '#7d8aa2',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: data?.chart_data?.labels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (e) {
          return + e.toLocaleString() + ' USD'
        },
        offsetX: 0,
        offsetY: 0,
      },
    },
    stroke: {
      width: 1,
      lineCap: 'round',
      curve: 'smooth',
      dashArray: [0, 3],
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
      strokeDashArray: 4,
      borderColor: 'rgba(170, 180, 195, 0.25)',
    },
    legend: {
      show: false,
    },
    colors: [themeColor, '#e49e3d'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (e) {
          return +e.toLocaleString() + ' USD'
        },
      },
    },
  }

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return t('Good Morning')
    } else if (hour < 18) {
      return t('Good Afternoon')
    } else {
      return t('Good Night')
    }
  }


  const getChartData = () => {
    return [
      {
        name: t("Investment amount"),
        data: data?.chart_data?.series,
        type: 'area',
      },
    ]
  }

  const [investActive, setInvestActive] = useState(false)


  function copyLink() {
    navigator.clipboard.writeText(`https://office.capitalmarket.app/auth/register/${user?.ref_code}`)
    toast.success(t("Link copied!"))
  }

  return (
    <div className=''>
      <TitleHelmet title={t("Dashboard")} />
      <div className="row align-items-center">
        <div className="col-12 col-lg mb-4">
          <h3 className="fw-normal mb-0 text-secondary">{getGreeting()},</h3>
          <h1>
            {t('Investor')} {user?.username}
          </h1>
          <Button onClick={() => setInvestActive(true)}>
            {t("Invest now")}
          </Button>
        </div>
        <div className="col-12 col-sm-4 col-lg-3 col-xl-2 mb-4">
          <div className="card adminuiux-card">
            <div className="card-body">
              <p className="text-secondary small mb-2">{t('Daily')}</p>
              <h4 className="mb-3">${data?.daily_payment?.toLocaleString() || 0} USD</h4>
              <span className="badge badge-light text-bg-success"><i className="me-1 bi bi-arrow-down-short" />+{data?.daily_percentage.toLocaleString()}%</span>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-4 col-lg-3 col-xl-2 mb-4">
          <div className="card adminuiux-card">
            <div className="card-body">
              <p className="text-secondary small mb-2">{t('Investment value')}</p>
              <h4 className="mb-3">${data?.investment_amount.toLocaleString() || 0} USD</h4>
              <span className="badge badge-light text-bg-danger"><i className="me-1 bi bi-arrow-down-short" />{new Date(data?.withdrawable_date || "").toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-4 col-lg-3 col-xl-2 mb-4">
          <div className="card adminuiux-card">
            <div className="card-body">
              <p className="text-secondary small mb-2">{t('Total Profit')}</p>
              <h4 className="mb-3">${data?.total_profit.toLocaleString() || 0} USD</h4>
              <span className="badge badge-light text-bg-info"><i className="me-1 bi bi-arrow-down-short" />{data?.days_profit} {t("days")}</span>
            </div>
          </div>
        </div>


      </div>
      <ButtonWithLink label={t("Copy link")} link={`https://office.capitalmarket.app/auth/register/${user?.ref_code}`}
        onClick={() => copyLink()} />
      <div className='row align-items-center '>
        <div className='col-xl-9 col-12'>
          <Card>
            <Card.Header className="d-flex align-items-center py-3">
              <Card.Title>{t("Investment progress")}</Card.Title>
            </Card.Header>
            <Card.Body >
              <ReactApexChart
                options={apexOptions}
                series={[...getChartData()]}
                type="area"
                height={360}
              />
            </Card.Body>
          </Card>
        </div>
        <div className="row col-xl-3 col-12 mt-4 mt-xl-0">
          <div className="col-xxl-12 col-6 col-6">
            <div className="card">
              <div className="text-center  card-body">
                <div className="mb-4 ">
                  <i className="fi fi-sr-users" style={{ fontSize: 64 }}></i>

                </div>
                <div>
                  <h6 className="fw-semibold mb-1 fs-1">{data?.direct_users || 0}</h6>
                  <p className="fs-13 fw-light text-muted mb-">{t("Direct users")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-12  col-6 mt-xl-4 mt-0">
            <div className="card">
              <div className="text-center  card-body">
                <div className="mb-4 ">
                  <i className="fi fi-sr-users-alt" style={{ fontSize: 64 }}></i>

                </div>
                <div>
                  <h6 className="fw-semibold mb-1 fs-1">{data?.indirect_users || 0}</h6>
                  <p className="fs-13 fw-light text-muted mb-3">{t("Indirect users")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PurchasePlanModal activeModal={investActive} handleCloseModal={() => setInvestActive(false)} />
    </div>
  )
}

export default Dashboard
