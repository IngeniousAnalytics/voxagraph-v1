// src/pages/Dashboard/components/DraggableChart.tsx
import React, {
  Fragment,
  useEffect,
  useState,
} from 'react';
import ChartWidget from './ChartWidget';
import CardWidget from './CardWidget';
import DynamicCard from './cards/DynamicCard';
import SearchQuestion from './SearchQuestion';
import AddQuery from './AddQuery';
import {
  fetchAskedQuestionResponse,
  fetchUserCsvUpload,
  fetchQueryResponse,
  fetchExecutedSQLResponse,
  setLoader,
} from '../../../services';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdQueryBuilder } from 'react-icons/md';
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { TbRefresh } from 'react-icons/tb';
import { Card, Group, Menu, Tooltip } from '@mantine/core';
import { IDraggableChart } from '../../../types';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { EColorPicker } from '@ai-dashboard/ui';
import { FaEdit } from 'react-icons/fa';
import TableWidget from './TableWidget';
import TextEditor from './TextEditor';
import '../styles/draggablechart.scss';
import { getPermissions } from '../../../permissions';
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
  setIsEditing,
  isEditing,
  charCode,
}) => {
  const dispatch = useAppDispatch();
  const [, { toggle }] = useDisclosure();
  const isPublished = new URLSearchParams(window.location.search).get('published') === 'true';
  const [defaultColor, onChange] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const { I_PERMIT, I_CONNECT_WITH } = getPermissions();
  const [isChartTitleChange, setIsChartTitleChange] = useState(false);
  
  // Constants for chart sizing adjustments
const CHART_HEADER_HEIGHT = 60; // Accounts for card padding/header
const CHART_WIDTH_OFFSET = 100; // Additional width buffer (or u
  // Redux selector removed - was causing unnecessary re-renders by returning entire state

  const handleLoadJson = async (values: unknown) => {
  // start loader & close the search box
  dispatch(setLoader(true));
  setShowSearch(false);

  try {
    const QUESTION = (values as Record<string, unknown>)?.question?.toString().trim();
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
    )) as unknown as { payload: { hasUpload: boolean } };

    let resp: Record<string, unknown>;

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
    const temp = resp?.payload as { title: string; query: string; questions: string; plot: unknown };
    onUpdateData(code, temp);
  } catch (err) {
    console.error('Error in handleLoadJson:', err);
  } finally {
    dispatch(setLoader(false));
  }
};

  const handleUserQuery = (values: Record<string, unknown>) => {
    dispatch(setLoader(true));
    setShowQuery(false);

    const payload = {
      query: values?.query,
      max_rows: 100,
    };

    try {
      dispatch(fetchExecutedSQLResponse(payload))
        .then((response: Record<string, unknown>) => {
          const temp = response?.payload as Record<string, unknown> | undefined;
          if (temp) {
            const updatePayload: { title: string; query: string; questions: string; plot: unknown; sql_query?: unknown } = { title: '', query: '', questions: '', plot: temp };
            const query = (values as Record<string, unknown>)?.query;
            if (query) {
              updatePayload.sql_query = query;
            }
            onUpdateData(code, updatePayload);
          }
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
        return (
          <CardWidget
            inputData={data}
            type={type}
            setGraphs={setGraphs}
            code={code}
            isChartTitleChange={isChartTitleChange}
            setIsChartTitleChange={setIsChartTitleChange}
            defaultColor={chartColor}
          />
        );
      case "metric":
      case "summary":
        // Use variant to determine layout: "metric" uses DynamicCard, "chart" uses different layout
        return (
          <DynamicCard
            inputData={data}
            setGraphs={setGraphs}
            code={code}
          />
        );
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
            minHeight={height - CHART_HEADER_HEIGHT}
            inputData={data}
            setGraphs={setGraphs}
            code={code}
            isChartTitleChange={isChartTitleChange}
            setIsChartTitleChange={setIsChartTitleChange}
            setChartCode={setChartCode}
            setIsEditing={setIsEditing}
            isPublished={isPublished}
          />
        );
      default:
        return (
          <ChartWidget
            type={type}
            variant={variant}
            width={width + CHART_WIDTH_OFFSET} 
            height={height - CHART_HEADER_HEIGHT}
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

  // Auto-open search question only for newly dragged charts (empty data)
  useEffect(() => {
    // Only show search for new charts that have no plot data yet
    const hasNoData = !data?.plot || data.plot.length === 0;
    // Enable for charts and card widgets; exclude text/metric/summary
    const isEligibleType = type !== 'text' && type !== 'metric' && type !== 'summary';
    const isChartsTab = activeTab === 'charts';

    if (isChartsTab && isEligibleType && !isPublished && hasNoData) {
      setShowSearch(true);
    }
  }, []); // run once on mount after drag-add

  useEffect(() => {
    if (defaultColor) {
      onChartColor(code, defaultColor);
    }
  }, [defaultColor, code, onChartColor]);

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
