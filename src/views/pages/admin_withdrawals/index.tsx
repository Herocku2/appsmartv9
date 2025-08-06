import React, { useState } from 'react';
import { Container, Table, Form, Button, Spinner, Alert, Pagination, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useGetAdminWithdrawalsQuery } from '../../../store/api/withdrawals/withdrawalsApiSlice';
import PayWithdrawalsModal from './PayWithdrawalsModal';
import Web3Context from './Web3Context';
import WithdrawalProcessor from './PayWithdrawalsModal';


const ADMIN_WITHDRAWAL_PAGE_SIZE = 10; // Define page size constant

const AdminWithdrawals: React.FC = () => {
    const { t } = useTranslation();

    const [selectedWithdrawals, setSelectedWithdrawals] = useState<Withdrawal[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(''); // State for status filter
    const [showConfirmationModal, setShowConfirmModal] = useState(false)

    const { data: withdrawalsData, error, isLoading, isFetching } = useGetAdminWithdrawalsQuery({
        page: currentPage,
        pageSize: ADMIN_WITHDRAWAL_PAGE_SIZE,
        status: statusFilter,
    });



    const handleCheckboxChange = (withdrawal: Withdrawal) => {
        // Only allow selection if the withdrawal status is 'PENDING' (status '1')
        if (withdrawal.status === '1') {
            setSelectedWithdrawals(prevSelected => {
                const isSelected = prevSelected.some(w => w.id === withdrawal.id);

                if (isSelected) {
                    // If already selected, remove it
                    return prevSelected.filter(w => w.id !== withdrawal.id);
                } else {
                    // If not selected, add it
                    return [...prevSelected, withdrawal];
                }
            });
        }
    };

    const handlePayButtonClick = () => {
        if (selectedWithdrawals.length === 0) {
            alert(t('Please select at least one withdrawal to pay.'));
            return;
        }
        setShowConfirmModal(true);
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedWithdrawals([]);
    };

    const handleStatusFilterChange = (e: string) => {
        setStatusFilter(e);
        setCurrentPage(1);
        setSelectedWithdrawals([]);
    };


    if (isLoading && !isFetching) return <Spinner animation="border" />; // Only show spinner on initial load
    if (error) return <Alert variant="danger">{t('Failed to load withdrawals. Please try again.')}</Alert>;
    if (!withdrawalsData) return <Alert variant="info">{t('No withdrawal data available.')}</Alert>;

    // Check if all displayed withdrawals are selected


    return (
        <Web3Context>
            <Card>
                <Card.Body>
                    <Container fluid className="admin-withdrawals-dashboard mt-4">
                        <h2 className="mb-4">{t('Administrator Withdrawals')}</h2>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Form.Group controlId="statusFilter">
                                <Form.Label>{t('Filter by Status:')}</Form.Label>
                                <Form.Control as="select" value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)}>
                                    <option value="">{t('All')}</option>
                                    <option value="1">{t('Pending')}</option>
                                    <option value="2">{t('Approved')}</option>
                                    {/* <option value="3">{t('Rejected')}</option> */}
                                </Form.Control>
                            </Form.Group>

                            {/* <Button
                                onClick={handlePayButtonClick}
                                disabled={selectedWithdrawals.length === 0}
                                className="ms-auto"
                            >
                                {t('Pay Selected')} ({selectedWithdrawals.length})
                            </Button> */}
                        </div>
                        {isFetching && (
                            <div className="text-center my-3">
                                <Spinner animation="border" size="sm" /> {t('Loading more data...')}
                            </div>
                        )}

                        <Table bordered hover responsive className="admin-withdrawals-table">
                            <thead>
                                <tr>
                                    <th>

                                    </th>
                                    <th>{t('ID')}</th>
                                    <th>{t('Date')}</th>
                                    <th>{t('User')}</th>
                                    <th>{t('Type')}</th>
                                    <th>{t('Amount')}</th>

                                    {/* <th>{t('Payed Date')}</th> */}
                                    <th>{t('Status')}</th>
                                    {/* <th>{t('Fee')}</th> */}
                                    <th>{t('Wallet Address')}</th>
                                    <th>{t('Hash')}</th>
                                    <th>{t('Detalle')}</th>
                                </tr>


                            </thead>
                            <tbody>
                                {withdrawalsData?.results?.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center">{t('No withdrawals found for the current criteria.')}</td>
                                    </tr>
                                ) : (
                                    withdrawalsData?.results?.map((withdrawal) => {

                                        return (
                                            <tr key={withdrawal.id}>
                                                <td>
                                                    {
                                                        (withdrawal.status == "1") && (
                                                            <div>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    checked={selectedWithdrawals.some(w => w.id === withdrawal.id)}

                                                                    onChange={() => handleCheckboxChange(withdrawal)}
                                                                // Disable checkbox if already paid or rejected (or other non-pending statuses)

                                                                />
                                                            </div>
                                                        )
                                                    }

                                                </td>
                                                <td>{withdrawal.id}</td>
                                                <td>{new Date(withdrawal.date).toLocaleString()}</td>
                                                <td>{withdrawal.user || 'N/A'}</td> {/* Handle nested user object */}
                                                <td>{t(withdrawal.verbose_type)}</td>
                                                <td>${withdrawal.amount.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}</td>

                                                {/* <td>{withdrawal.payed_date ? new Date(withdrawal.payed_date).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) : t('N/A')}</td> */}
                                                <td>{t(withdrawal.verbose_status)}</td>
                                                {/* <td>${parseFloat(withdrawal.fee).toFixed(2)}</td> */}
                                                <td>{withdrawal.wallet_address.slice(0, 10)}...</td>
                                                <td >
                                                    {withdrawal.payment_link ? (
                                                        <a className='text-primary' href={"https://bscscan.com/tx/" + withdrawal.payment_link} target="_blank" rel="noopener noreferrer">
                                                            {t('View Transaction')}
                                                        </a>
                                                    ) : (
                                                        t('N/A')
                                                    )}
                                                </td>
                                                <td className='text-danger'>
                                                    {withdrawal?.refuse_message || " - "}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-center">
                            <Pagination className="mb-0">
                                <Pagination.Prev disabled={currentPage == 1} onClick={() => handlePageChange(currentPage - 1)} />
                                {[...Array(withdrawalsData?.total_pages)].map((_, index) => (
                                    <Pagination.Item onClick={() => handlePageChange(index + 1)} key={index}>{index + 1}</Pagination.Item>
                                ))}
                                <Pagination.Next disabled={currentPage == withdrawalsData?.total_pages}
                                    onClick={() => handlePageChange(currentPage + 1)} />
                            </Pagination>
                        </div>
                    </Container>
                </Card.Body>
                {
                    (selectedWithdrawals?.length > 0) && (
                        <WithdrawalProcessor
                            selectedWithdrawals={selectedWithdrawals} setSelectedWithdrawals={setSelectedWithdrawals} />
                    )
                }

            </Card>
        </Web3Context>
    );
};

export default AdminWithdrawals;