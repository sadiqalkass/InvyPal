import { useAuth } from '../context/AuthContext'
import { formatDate } from '../lib/utils'

const TransactionTable = () => {
    const {transactions, getSeller} = useAuth()

  return (
    <div className="w-[90%] m-4 max-w-[65rem] md:m-5">
      <p className="mb-3">Category List</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll scrollbar-hide">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_1fr_2fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Item Name</p>
          <p>Price(₦)</p>
          <p>Quantity</p>
          <p>Sold By</p>
          <p>Date</p>
        </div>
        {transactions.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_2fr_1fr_2fr_1fr] text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center">
              <p>{item.itemName.length  > 10 ? `${item.itemName.slice(0, 10)}...` : item.itemName}</p>
            </div>

            <p className="max-sm:hidden">{item.amount}</p>

            <div className="flex items-center">
            <p className="pl-2">{item.quantity}</p>
            </div>
            <p className='text-[10px] hidden md:block text-green-600'>{getSeller(item.userId)}</p>

              <p
                className="text-[10px] text-purple-800"
              >
                {formatDate(item.$createdAt)}
              </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionTable
