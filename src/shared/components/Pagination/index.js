import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

/**
 * Componente de Paginação padronizado
 * @param {number} pageCount - Total de páginas
 * @param {number} currentPage - Página atual (0-indexed)
 * @param {function} onPageChange - Callback quando a página muda (recebe o número da página)
 */
export default function Pagination({ pageCount, currentPage, onPageChange }) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage}
      onPageChange={({ selected }) => onPageChange(selected)}
      containerClassName={styles.pagination}
      pageClassName={styles.page}
      pageLinkClassName={styles.pageLink}
      activeClassName={styles.active}
      previousClassName={styles.page}
      nextClassName={styles.page}
      previousLinkClassName={styles.pageLink}
      nextLinkClassName={styles.pageLink}
      breakClassName={styles.page}
      breakLinkClassName={styles.pageLink}
      disabledClassName={styles.disabled}
      previousLabel="‹"
      nextLabel="›"
      breakLabel="…"
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
    />
  );
}
