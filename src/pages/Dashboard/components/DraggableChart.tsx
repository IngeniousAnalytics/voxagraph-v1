// src/pages/Dashboard/components/DraggableChart.tsx
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as RiIcons from 'react-icons/ri';
import Draggable from 'react-draggable';
import CardWidget from './CardWidget';
import ChartWidget from './ChartWidget';
import SearchQuestion from './SearchQuestion';
import AddQuery from './AddQuery';
import {
  fetchAskedQuestionResponse,
  fetchUserCsvUpload,
  fetchQueryResponse,
  fetchExecutedSQLResponse,
  setLoader,
} from 'src/services';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdQueryBuilder } from 'react-icons/md';
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { TbRefresh } from 'react-icons/tb';
import { Card, Group, Menu, Tooltip } from '@mantine/core';
import { IDraggableChart, IAuthMenuItem } from 'src/types';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { EColorPicker } from '@ai-dashboard/ui';
import { FaEdit } from 'react-icons/fa';
import TableWidget from './TableWidget';
import TextEditor from './TextEditor';
import '../styles/draggablechart.scss';
import { getPermissions } from 'src/permissions';
import TitleChart from './TitleChart';

const DraggableChart: React.FC<IDraggableChart> = ({
  code,
  type,
  chartColor,
  variant,
  x,
  y,
  width,
  height,
  data,
  onUpdatePosition,
  onUpdateData,
  onResize,
  onRefresh,
  onDelete,
  activeTab,
  onChartColor,
  publishedParams,
  setGraphs,
  setChartCode,
  setTextTilteData,
  setIsEditing,
  isEditing,
  charCode,
}) => {
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure();
  const isPublished = window.location.hash.startsWith('#/published');
  const [defaultColor, onChange] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const { I_PERMIT, I_CONNECT_WITH } = getPermissions();
  const [isChartTitleChange, setIsChartTitleChange] = useState(false);

  const {
    dashboardServices: { authMenus },
  } = useAppSelector((state: any) => state);

  const handleLoadJson = async (values: any) => {
  // start loader & close the search box
  dispatch(setLoader(true));
  setShowSearch(false);

  try {
    const QUESTION = values.question?.trim();
    if (!QUESTION) return;

    // you already have I_CONNECT_WITH in this component
    const DB_ID = I_CONNECT_WITH?.db_id;
    // pull user_id from localStorage or permissions object
    const USER_ID =
      I_CONNECT_WITH?.user_id ||
      JSON.parse(localStorage.getItem('userInfo') || '{}')?.user_id;

    // --- STEP 1: check CSV/Excel upload flag ---
    const { payload: { hasUpload } } = (await dispatch(
      fetchUserCsvUpload({ user_id: USER_ID })
    )) as any;

    let resp: any;

    // --- STEP 2: branch by upload flag ---
    if (hasUpload) {
      // CSV/Excel present → /query (user_id)
      resp = await dispatch(
        fetchQueryResponse({ question: QUESTION, user_id: USER_ID })
      );
    } else {
      // No upload → /ask (db_id)
      resp = await dispatch(
        fetchAskedQuestionResponse({ question: QUESTION, db_id: DB_ID })
      );
    }

    // --- STEP 3: update chart as usual ---
    const temp = resp?.payload;
    onUpdateData(code, temp);
  } catch (err) {
    console.error('Error in handleLoadJson:', err);
  } finally {
    dispatch(setLoader(false));
  }
};

  const handleUserQuery = (values: any) => {
    dispatch(setLoader(true));
    setShowQuery(false);

    const payload = {
      query: values?.query,
      max_rows: 100,
    };

    try {
      dispatch(fetchExecutedSQLResponse(payload))
        .then((response: any) => {
          const temp = response?.payload;

          onUpdateData(code, { ...temp, sql_query: values?.query });
        })
        .finally(() => {
          dispatch(setLoader(false));
        });
    } catch {
      dispatch(setLoader(false));
    }
  };

  const renderMenus = () => {
    return (
      <Menu
        shadow="md"
        width={150}
        withArrow
        transitionProps={{ transition: 'fade-up', duration: 150 }}
      >
        <Menu.Target>
          <div
            onClick={(e) => e.stopPropagation()} // <- Critical line
            style={{ cursor: 'pointer' }}
          >
            <RxHamburgerMenu onClick={toggle} size={20} />
          </div>
        </Menu.Target>
        <Menu.Dropdown className="header-actions--notify-dd">
          <Menu.Item
            onClick={() => {
              toggle();
              setShowSearch(true);
            }}
            leftSection={<FaQuestionCircle size={20} />}
          >
            Question
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              toggle();
              setShowQuery(true);
            }}
            leftSection={<MdQueryBuilder size={20} />}
          >
            SQL Query
          </Menu.Item>
          <Menu.Item
            onClick={() => setIsChartTitleChange(true)}
            disabled={!I_PERMIT.i_chart_title_change}
            leftSection={<FaEdit size={20} />}
          >
            Change Chart Title
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              toggle();
              setShowPicker(true);
            }}
            leftSection={<IoColorPaletteOutline size={20} />}
          >
            Colors
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              toggle();
              onDelete(code);
            }}
            leftSection={<RxCross2 color="red" size={20} />}
          >
            Remove
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const renderItem = () => {
    switch (type) {
      case 'card':
        return <CardWidget inputData={data} type={type} 
        isChartTitleChange={isChartTitleChange}
        setIsChartTitleChange={setIsChartTitleChange}
        isPublished={isPublished}
        defaultColor={defaultColor}
        setGraphs={setGraphs}
        code={code}
        />;
      case 'table':
        return (
          <TableWidget
            inputData={data}
            type={type}
            setGraphs={setGraphs}
            code={code}
            isChartTitleChange={isChartTitleChange}
            setIsChartTitleChange={setIsChartTitleChange}
            isPublished={isPublished}
          />
        );
      case 'text':
        return (
          <TitleChart
            minHeight={height - 60}
            inputData={data}
            setGraphs={setGraphs}
            code={code}
            isChartTitleChange={isChartTitleChange}
            setIsChartTitleChange={setIsChartTitleChange}
            setChartCode={setChartCode}
            setTextTilteData={setTextTilteData}
            setIsEditing={setIsEditing}
            isPublished={isPublished}
          />
        );
      default:
        return (
          <ChartWidget
            type={type}
            variant={variant}
            width={width + 100}
            height={height - 60}
            inputData={data}
            setGraphs={setGraphs}
            code={code}
            isChartTitleChange={isChartTitleChange}
            isPublished={isPublished}
            setIsChartTitleChange={setIsChartTitleChange}
            onDelete={onDelete}
          />
        );
    }
  };

  useEffect(() => {
    if (activeTab === 'charts' && !isPublished && type !== 'text') {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  }, []);

  useEffect(() => {
    if (defaultColor) {
      onChartColor(code, defaultColor);
    }
  }, [defaultColor]);

  return (
    <Fragment>
      <div className="vg-textedit--wrap">
        {/* <input checked={!!isEditing} type='checkbox' className='vg-textedit--check' id={`checkme-${code}`} /> */}
        <Card
          withBorder
          shadow="sm"
          radius="md"
          px="md"
          // id={`${type}_${code}`}
          style={{ backgroundColor: chartColor, height: '100%' }}
        >
          {type !== 'text' && (
            <Card.Section inheritPadding py="xs">
              <Group justify="end">
                <div className="action-wrappers">
                  <Tooltip label="Refresh" position="left" withArrow>
                    <TbRefresh
                      size={20}
                      color="#3f8919"
                      onClick={() =>
                        onRefresh(
                          code,
                          data?.query,
                          publishedParams?.db ?? 0,
                          Number(publishedParams?.user_id ?? 0)
                        )
                      }
                    />
                  </Tooltip>
                  <div>{!isPublished && renderMenus()}</div>
                </div>
              </Group>
            </Card.Section>
          )}
          <Card.Section inheritPadding py="xs">
            {renderItem()}
          </Card.Section>
        </Card>
        {type === 'text' && code === charCode && (
          <TextEditor
            setGraphs={setGraphs}
            publishedParams={publishedParams}
            onDelete={onDelete}
            code={code}
            inputData={data}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            defaultColor={defaultColor}
            setShowPicker={setShowPicker}
          />
        )}
      </div>
      {/* </div> */}

      {/* Keep the modals */}
      {showSearch && (
        <SearchQuestion
          show={showSearch}
          setShow={setShowSearch}
          onSubmit={handleLoadJson}
          jsonArray={data}
          I_PERMIT={I_PERMIT}
        />
      )}

      {showQuery && (
        <AddQuery
          show={showQuery}
          setShow={setShowQuery}
          jsonArray={data}
          onSubmit={handleUserQuery}
          I_PERMIT={I_PERMIT}
        />
      )}
      {showPicker && (
        <EColorPicker
          show={showPicker}
          setShow={setShowPicker}
          value={defaultColor}
          onChange={onChange}
        />
      )}
    </Fragment>
  );
};

export default DraggableChart;
