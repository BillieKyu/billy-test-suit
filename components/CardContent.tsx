import Image from 'next/image';

type Idea = {
  id: number;
  published_at: string;
  title: string;
  small_image?: { url: string }[];
  medium_image?: { url: string }[];
};

type Props = {
  ideas?: Idea[];
};

const formatDateToBahasaIndonesia = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};


const CardContent: React.FC<Props> = ({ ideas }: any) => {
  return (
    <div className="flex flex-row gap-5 flex-wrap justify-center mt-6">
      {ideas.map((idea: any) => (
        <div key={idea.id} className="w-[280px] h-[300px] shadow-md rounded-xl">
          <div className="w-full h-[60%] relative">
            <Image
              src={idea.small_image?.[0]?.url || idea.medium_image?.[0]?.url || '/background.jpg'}
              alt="content"
              layout="fill"
              className="rounded-t-xl"
              loading="lazy"
            />
          </div>
          
          <div className='p-3'>
            <p className="text-[12px] text-gray-400">
              {formatDateToBahasaIndonesia(idea.published_at)}
            </p>
            <h1 className="text-lg font-bold overflow-hidden line-clamp-3">{idea.title}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardContent;
