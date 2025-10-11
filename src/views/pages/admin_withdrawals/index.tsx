import React, { useMemo, useState } from 'react';
import { Container, Table, Form, Button, Spinner, Alert, Pagination, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useGetAdminWithdrawalsQuery } from '../../../store/api/withdrawals/withdrawalsApiSlice';
import PayWithdrawalsModal from './PayWithdrawalsModal';
import Web3Context from './Web3Context';
import WithdrawalProcessor from './PayWithdrawalsModal';
import ControlledPagination from '../../../components/UiElements/Base/Pagination';
import toast from 'react-hot-toast';
import FiatPaymentModal from './FiatPaymentModal';


const ADMIN_WITHDRAWAL_PAGE_SIZE = 10; // Define page size constant

const AdminWithdrawals: React.FC = () => {
    const { t } = useTranslation();

    const [selectedWithdrawals, setSelectedWithdrawals] = useState<Withdrawal[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(''); // State for status filter
    const [methodFilter, setMethodFilter] = useState('');
    const [showConfirmationModal, setShowConfirmModal] = useState(false)

    const [showFiatModal, setShowFiatModal] = useState(false);
    const [fiatWithdrawalToProcess, setFiatWithdrawalToProcess] = useState<Withdrawal | null>(null);


    const { data: withdrawalsData, error, isLoading, isFetching } = useGetAdminWithdrawalsQuery({
        page: currentPage,
        pageSize: ADMIN_WITHDRAWAL_PAGE_SIZE,
        status: statusFilter,
        method: methodFilter
    });



    const handleCheckboxChange = (withdrawal: Withdrawal) => {
        if (withdrawal.status !== '1') return; // Solo permite seleccionar pendientes

        const isCurrentlySelected = selectedWithdrawals.some(w => w.id === withdrawal.id);
        if (isCurrentlySelected) {
            // Si se deselecciona, limpiar toda la selección
            setSelectedWithdrawals([...selectedWithdrawals?.filter(w => w.id != withdrawal.id)]);
            return;
        }



        const firstSelectionMethod = selectedWithdrawals.length > 0 ? selectedWithdrawals[0].method : null;

        // Lógica para FIAT
        if (withdrawal.method === 'fiat') {
            setSelectedWithdrawals([withdrawal]); // FIAT es selección única
            setShowFiatModal(true)
            setFiatWithdrawalToProcess(withdrawal)
        }
        // Lógica para Crypto
        else if (withdrawal.method === 'crypto') {
            if (!firstSelectionMethod || firstSelectionMethod === 'crypto') {
                setSelectedWithdrawals(prev => [...prev, withdrawal]); // Permite selección múltiple de crypto
            } else {
                toast.error(t("You can only select Crypto withdrawals together."));
            }
        }
    };

    const handlePayButtonClick = () => {
        if (selectedWithdrawals.length === 0) {
            alert(t('Please select at least one withdrawal to pay.'));
            return;
        }
        setShowConfirmModal(true);
    };

    const selectionType = useMemo(() => {
        if (selectedWithdrawals.length === 0) return null;
        return selectedWithdrawals[0].method;
    }, [selectedWithdrawals]);

    // NUEVO: Manejador para el botón de pago FIAT
    const handleProcessFiatClick = () => {
        if (selectionType === 'fiat' && selectedWithdrawals.length === 1) {
            setFiatWithdrawalToProcess(selectedWithdrawals[0]);
            setShowFiatModal(true);
        }
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

    const handleMethodFilterChange = (e: string) => {
        setMethodFilter(e);
        setCurrentPage(1);
        setSelectedWithdrawals([]);
    };

    const handleFiatPaymentSuccess = () => {
        setSelectedWithdrawals([]);
        setFiatWithdrawalToProcess(null);
        // La data se refrescará automáticamente gracias al sistema de caché de RTK Query
    };


    if (isLoading && !isFetching) return <Spinner animation="border" />; // Only show spinner on initial load
    if (error) return <Alert variant="danger">{t('Failed to load withdrawals. Please try again.')}</Alert>;
    if (!withdrawalsData) return <Alert variant="info">{t('No withdrawal data available.')}</Alert>;

    // Check if all displayed withdrawals are selected

    console.log(selectionType);

    return (
        <Web3Context>
            <Card>
                <Card.Body>
                    <Container fluid className="admin-withdrawals-dashboard mt-4">
                        <h2 className="mb-4">{t('Administrator Withdrawals')}</h2>
                        <div className="d-flex justify-content-start align-items-center mb-3 gap-4">
                            <Form.Group controlId="statusFilter">
                                <Form.Label>{t('Filter by Status:')}</Form.Label>
                                <Form.Control as="select" value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)}>
                                    <option value="">{t('All')}</option>
                                    <option value="1">{t('Pending')}</option>
                                    <option value="2">{t('Approved')}</option>
                                    {/* <option value="3">{t('Rejected')}</option> */}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="methodFilter">
                                <Form.Label>{t('Filter by Method:')}</Form.Label>
                                <Form.Control as="select" value={methodFilter} onChange={(e) => handleMethodFilterChange(e.target.value)}>
                                    <option value="">{t('All')}</option>
                                    <option value="fiat">{t('FIAT')}</option>
                                    <option value="crypto">{t('Crypto')}</option>
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
                                    <th>{t('Method')}</th>
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
                                                        (withdrawal.status == "1" && (selectionType == withdrawal.method || !selectionType)) && (
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
                                                <td>{withdrawal.verbose_method}</td>
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
                                                    ) : (withdrawal.payment_invoice) ? (
                                                        <a className='text-primary' href={withdrawal.payment_invoice} target="_blank" rel="noopener noreferrer">
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

                        <div className="d-flex justify-content-center mt-4">
                            <ControlledPagination
                                currentPage={currentPage}
                                totalPages={withdrawalsData?.total_pages || 1}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </Container>
                </Card.Body>
                {selectionType === 'crypto' && selectedWithdrawals.length > 0 && (
                    <WithdrawalProcessor
                        selectedWithdrawals={selectedWithdrawals}
                        setSelectedWithdrawals={setSelectedWithdrawals}
                    />
                )}
                {fiatWithdrawalToProcess != null && (
                    <FiatPaymentModal
                        show={showFiatModal}
                        onHide={() => setShowFiatModal(false)}
                        withdrawal={fiatWithdrawalToProcess}
                        onSuccess={handleFiatPaymentSuccess}
                    />
                )}

            </Card>
        </Web3Context>
    );
};

export default AdminWithdrawals;