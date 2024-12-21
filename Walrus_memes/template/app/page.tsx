'use client'
import { ConnectButton } from '@mysten/dapp-kit'
import Image from 'next/image'
import { getUserProfile } from '@/lib/contracts'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useEffect, useState } from 'react'
import { CategorizedObjects, calculateTotalBalance, formatBalance } from '@/utils/assetsHelpers'
import type { RadioChangeEvent } from 'antd';
import { Radio, Tabs } from 'antd';
type TabPosition = 'new' | 'hot';
import { Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import type { WalletAccount } from '@mysten/wallet-standard';
import { ReadonlyUint8Array, IdentifierArray, WalletIcon } from '@mysten/wallet-standard';

// 假设以下是一些示例值，用于填充WalletAccount接口所需的属性
const sampleAddress = '0xYourWalletAddress';
const samplePublicKey = new Uint8Array([/* 公钥的字节数组 */]);
const sampleChains = ['chainA', 'chainB'] as unknown as IdentifierArray;
const sampleFeatures = ['feature1', 'feature2'] as unknown as IdentifierArray;
const sampleLabel = 'My Wallet Account';
const sampleIcon = { /* WalletIcon的具体实现 */ } as WalletIcon;

// 定义一个符合WalletAccount接口的变量
const walletAccount: WalletAccount = {
    address: sampleAddress,
    publicKey: samplePublicKey,
    chains: sampleChains,
    features: sampleFeatures,
    label: sampleLabel,
    icon: sampleIcon
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
export default function Home() {
  // const account = useCurrentAccount();
  const account = walletAccount;
  const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
  console.log(account, 'account')
  console.log(userObjects, 'userObjects')
  useEffect(() => {
    async function fetchUserProfile() {
      if (account?.address) {
        try {
          const profile = await getUserProfile(account.address);
          setUserObjects(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    }

    fetchUserProfile();
  }, [account]);

  // 设置tab切换
  const [mode, setMode] = useState<TabPosition>('new');

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  // 图片上传
  const [fileList0, setFileList0] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      url: '/logo/logo.jpg'
    },
  ]);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      url: '/logo/image.png'
    },
  ]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      url: '/logo/image2.png'
    },
  ]);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image: HTMLImageElement = new (window.Image as any)();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center rounded-full overflow-hidden">
          {
            !fileList0.length && (
            <Upload
              className='mr-10'
              action=""
              listType="picture-card"
              fileList={fileList0}
              onChange={onChange}
              onPreview={onPreview}
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
            )
          }
          <Image className='ml-16' src={fileList0[0].url || '/logo/logo.jpg'} alt="Sui Logo" width={80} height={40} />
        </div>
        <ConnectButton />
      </header>
      <div className='mt-14 mb-14 ml-16 mr-16'>
        <div>
          <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
            <Radio.Button value="new">由新到旧</Radio.Button>
            <Radio.Button value="hot">热门程度</Radio.Button>
          </Radio.Group>

        </div>
        {
          mode === 'new' ? (
          <div className='flex mt-10'>
            <div className='flex-grow flex'>
              <Upload
                className='mr-10'
                action=""
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 6 && '+ Upload'}
              </Upload>
              {/* <Image src="/logo/image.png" alt="Sui Logo" width={100} height={100}/> */}
              <div className='ml-2 mr-2'>name: 由新到旧</div>
            </div>
          </div>
          ) : (
          <div className='flex mt-10'>
            <div className='flex-grow flex'>
              <Upload
                action=""
                listType="picture-card"
                fileList={fileList2}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 6 && '+ Upload'}
              </Upload>
              {/* <Image src="/logo/image.png" alt="Sui Logo" width={100} height={100}/> */}
              <div className='ml-2 mr-2'>name: 热门程度</div>
            </div>
          </div>
          )
        }
      </div>
      {/* {userObjects!=null ? (
      <main className="flex-grow flex flex-col items-center p-8">        
        {userObjects && (
          <div className="w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4">Your Assets</h2>
            
            <div className="flex gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Coins</h3>
                {Object.entries(userObjects.coins).map(([coinType, coins]) => {
                  const totalBalance = calculateTotalBalance(coins);
                  return (
                    <div key={coinType} className="mb-4 p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-medium text-lg">{coinType.split('::').pop()}</h4>
                      <p>Count: {coins.length}</p>
                      <p>Total Balance: {formatBalance(totalBalance)}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Other Objects</h3>
                <div className="h-[500px] overflow-y-auto pr-4">
                  {Object.entries(userObjects.objects).map(([objectType, objects]) => (
                    <div key={objectType} className="mb-4 p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-medium text-lg">{objectType.split('::').pop()}</h4>
                      <p>Count: {objects.length}</p>
                      <p className="text-gray-500 text-sm">{objectType.split('::').pop()}</p>
                      <p className="text-gray-500 text-sm">{objectType.split('::')[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      ):(
        <div className="flex-grow flex flex-col items-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Nextjs Sui Dapp Template</h1>
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Please connect your wallet to view your assets</h3>
        </div>        
      )} */}
    </div>
  );
}
